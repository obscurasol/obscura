import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
  Keypair
} from '@solana/web3.js';

// ============================================
// TYPES
// ============================================

export interface ShadowDuelGame {
  id: string;
  creator: string;
  opponent: string | null;
  stake: number; // in lamports
  escrowAddress: string; // where stakes are held
  
  // Commit-reveal: players commit hash first, then reveal
  creatorCommit: string | null;   // hash(allocation + secret)
  opponentCommit: string | null;
  creatorReveal: { allocation: number[]; secret: string } | null;
  opponentReveal: { allocation: number[]; secret: string } | null;
  
  currentRound: number;
  revealedRounds: { creator: number; opponent: number }[];
  winner: string | null;
  status: 'waiting' | 'joined' | 'committing' | 'revealing' | 'showdown' | 'completed';
  createdAt: number;
  
  // Transaction signatures
  createTx: string | null;
  joinTx: string | null;
  payoutTx: string | null;
}

export interface GameLobbyItem {
  id: string;
  creator: string;
  stake: number;
  createdAt: number;
}

// ============================================
// STORAGE (localStorage for persistence)
// ============================================

const STORAGE_KEY = 'obscura_shadow_duel_games';

function loadGames(): Map<string, ShadowDuelGame> {
  if (typeof window === 'undefined') return new Map();
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return new Map(Object.entries(parsed));
    }
  } catch (e) {
    console.error('Failed to load games:', e);
  }
  return new Map();
}

function saveGames(games: Map<string, ShadowDuelGame>): void {
  if (typeof window === 'undefined') return;
  
  try {
    const obj = Object.fromEntries(games);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch (e) {
    console.error('Failed to save games:', e);
  }
}

// ============================================
// CRYPTOGRAPHIC COMMIT-REVEAL
// ============================================

// Generate a random secret for commitment
export function generateSecret(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

// Create commitment hash: SHA-256(allocation + secret)
export async function createCommitment(allocation: number[], secret: string): Promise<string> {
  const data = JSON.stringify({ allocation, secret });
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Verify that a reveal matches a commitment
export async function verifyCommitment(
  allocation: number[], 
  secret: string, 
  commitment: string
): Promise<boolean> {
  const computedCommit = await createCommitment(allocation, secret);
  return computedCommit === commitment;
}

// ============================================
// GAME MANAGEMENT
// ============================================

export function createGame(creator: string, stake: number): ShadowDuelGame {
  const games = loadGames();
  const id = `duel_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  
  // Generate a deterministic escrow address (in production, this would be a PDA)
  const escrowAddress = Keypair.generate().publicKey.toBase58();
  
  const game: ShadowDuelGame = {
    id,
    creator,
    opponent: null,
    stake,
    escrowAddress,
    creatorCommit: null,
    opponentCommit: null,
    creatorReveal: null,
    opponentReveal: null,
    currentRound: 0,
    revealedRounds: [],
    winner: null,
    status: 'waiting',
    createdAt: Date.now(),
    createTx: null,
    joinTx: null,
    payoutTx: null,
  };
  
  games.set(id, game);
  saveGames(games);
  return game;
}

export function joinGame(gameId: string, opponent: string): ShadowDuelGame | null {
  const games = loadGames();
  const game = games.get(gameId);
  if (!game || game.opponent || game.creator === opponent) return null;
  
  game.opponent = opponent;
  game.status = 'committing';
  games.set(gameId, game);
  saveGames(games);
  
  return game;
}

export function submitCommitment(
  gameId: string, 
  player: string, 
  commitment: string
): ShadowDuelGame | null {
  const games = loadGames();
  const game = games.get(gameId);
  if (!game) return null;
  
  if (player === game.creator) {
    game.creatorCommit = commitment;
  } else if (player === game.opponent) {
    game.opponentCommit = commitment;
  } else {
    return null;
  }
  
  // Check if both have committed
  if (game.creatorCommit && game.opponentCommit) {
    game.status = 'revealing';
  }
  
  games.set(gameId, game);
  saveGames(games);
  return game;
}

export async function submitReveal(
  gameId: string,
  player: string,
  allocation: number[],
  secret: string
): Promise<{ success: boolean; game: ShadowDuelGame | null; error?: string }> {
  const games = loadGames();
  const game = games.get(gameId);
  if (!game) return { success: false, game: null, error: 'Game not found' };
  
  // Validate allocation
  const total = allocation.reduce((a, b) => a + b, 0);
  if (total !== 10 || allocation.length !== 3) {
    return { success: false, game: null, error: 'Allocation must sum to 10' };
  }
  if (allocation.some(v => v < 0 || v > 10)) {
    return { success: false, game: null, error: 'Invalid allocation values' };
  }
  
  // Verify commitment
  const commitment = player === game.creator ? game.creatorCommit : game.opponentCommit;
  if (!commitment) {
    return { success: false, game: null, error: 'No commitment found' };
  }
  
  const isValid = await verifyCommitment(allocation, secret, commitment);
  if (!isValid) {
    return { success: false, game: null, error: 'Reveal does not match commitment' };
  }
  
  // Store reveal
  if (player === game.creator) {
    game.creatorReveal = { allocation, secret };
  } else if (player === game.opponent) {
    game.opponentReveal = { allocation, secret };
  } else {
    return { success: false, game: null, error: 'Not a player in this game' };
  }
  
  // Check if both have revealed
  if (game.creatorReveal && game.opponentReveal) {
    game.status = 'showdown';
    game.currentRound = 1;
  }
  
  games.set(gameId, game);
  saveGames(games);
  return { success: true, game };
}

export function revealNextRound(gameId: string): ShadowDuelGame | null {
  const games = loadGames();
  const game = games.get(gameId);
  if (!game || game.status !== 'showdown') return null;
  if (!game.creatorReveal || !game.opponentReveal) return null;
  
  const roundIndex = game.currentRound - 1;
  if (roundIndex >= 3) return null;
  
  const creatorPower = game.creatorReveal.allocation[roundIndex];
  const opponentPower = game.opponentReveal.allocation[roundIndex];
  
  game.revealedRounds.push({
    creator: creatorPower,
    opponent: opponentPower
  });
  
  game.currentRound++;
  
  // Check if all rounds revealed
  if (game.currentRound > 3) {
    game.status = 'completed';
    game.winner = determineWinner(game);
  }
  
  games.set(gameId, game);
  saveGames(games);
  return game;
}

function determineWinner(game: ShadowDuelGame): string | null {
  if (game.revealedRounds.length !== 3) return null;
  
  let creatorWins = 0;
  let opponentWins = 0;
  
  for (const round of game.revealedRounds) {
    if (round.creator > round.opponent) {
      creatorWins++;
    } else if (round.opponent > round.creator) {
      opponentWins++;
    }
  }
  
  if (creatorWins > opponentWins) return game.creator;
  if (opponentWins > creatorWins) return game.opponent;
  
  // Tiebreaker: total power in won rounds, then random
  return Math.random() > 0.5 ? game.creator : game.opponent;
}

export function getGame(gameId: string): ShadowDuelGame | null {
  const games = loadGames();
  return games.get(gameId) || null;
}

export function getOpenGames(): GameLobbyItem[] {
  const games = loadGames();
  const openGames: GameLobbyItem[] = [];
  
  games.forEach((game) => {
    if (game.status === 'waiting') {
      openGames.push({
        id: game.id,
        creator: game.creator,
        stake: game.stake,
        createdAt: game.createdAt
      });
    }
  });
  
  return openGames.sort((a, b) => b.createdAt - a.createdAt);
}

export function getPlayerGames(player: string): ShadowDuelGame[] {
  const games = loadGames();
  const playerGames: ShadowDuelGame[] = [];
  
  games.forEach((game) => {
    if (game.creator === player || game.opponent === player) {
      playerGames.push(game);
    }
  });
  
  return playerGames.sort((a, b) => b.createdAt - a.createdAt);
}

export function updateGameTx(gameId: string, field: 'createTx' | 'joinTx' | 'payoutTx', signature: string): void {
  const games = loadGames();
  const game = games.get(gameId);
  if (game) {
    game[field] = signature;
    games.set(gameId, game);
    saveGames(games);
  }
}

// ============================================
// SOLANA TRANSACTIONS
// ============================================

export async function createStakeTransaction(
  connection: Connection,
  from: PublicKey,
  stakeAmount: number
): Promise<Transaction> {
  // In production: transfer to escrow PDA
  // For devnet demo: we'll do a small transfer to prove stake
  const transaction = new Transaction();
  
  // Create a memo-like transfer to self (proves stake ability)
  // Real implementation would transfer to escrow
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: from,
      toPubkey: from, // Self-transfer for demo
      lamports: 1000, // Minimal amount for proof
    })
  );
  
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = from;
  
  return transaction;
}

export async function createPayoutTransaction(
  connection: Connection,
  winner: PublicKey,
  loser: PublicKey,
  amount: number
): Promise<Transaction> {
  // In production: release from escrow to winner
  // For devnet demo: symbolic transaction
  const transaction = new Transaction();
  
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: winner,
      toPubkey: winner,
      lamports: 1000,
    })
  );
  
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = winner;
  
  return transaction;
}

// ============================================
// UTILITIES
// ============================================

export function formatStake(lamports: number): string {
  return (lamports / LAMPORTS_PER_SOL).toFixed(4);
}

export function parseStake(sol: string): number {
  return Math.floor(parseFloat(sol) * LAMPORTS_PER_SOL);
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}
