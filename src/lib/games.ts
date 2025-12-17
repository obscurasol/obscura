import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';

export interface ShadowDuelGame {
  id: string;
  creator: string;
  opponent: string | null;
  stake: number; // in lamports
  creatorAllocation: number[] | null; // [round1, round2, round3]
  opponentAllocation: number[] | null;
  currentRound: number; // 0 = waiting, 1-3 = revealing, 4 = complete
  revealedRounds: { creator: number; opponent: number }[];
  winner: string | null;
  status: 'waiting' | 'joined' | 'allocated' | 'revealing' | 'completed';
  createdAt: number;
}

export interface GameLobbyItem {
  id: string;
  creator: string;
  stake: number;
  createdAt: number;
}

// In-memory game storage (would be on-chain in production)
const games: Map<string, ShadowDuelGame> = new Map();
const encryptedAllocations: Map<string, Map<string, number[]>> = new Map();

export function createGame(creator: string, stake: number): ShadowDuelGame {
  const id = `shadow_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  
  const game: ShadowDuelGame = {
    id,
    creator,
    opponent: null,
    stake,
    creatorAllocation: null,
    opponentAllocation: null,
    currentRound: 0,
    revealedRounds: [],
    winner: null,
    status: 'waiting',
    createdAt: Date.now()
  };
  
  games.set(id, game);
  return game;
}

export function joinGame(gameId: string, opponent: string): ShadowDuelGame | null {
  const game = games.get(gameId);
  if (!game || game.opponent || game.creator === opponent) return null;
  
  game.opponent = opponent;
  game.status = 'joined';
  games.set(gameId, game);
  
  return game;
}

export function submitAllocation(
  gameId: string, 
  player: string, 
  allocation: number[]
): ShadowDuelGame | null {
  const game = games.get(gameId);
  if (!game) return null;
  
  // Validate allocation sums to 10
  const total = allocation.reduce((a, b) => a + b, 0);
  if (total !== 10 || allocation.length !== 3) return null;
  if (allocation.some(v => v < 0 || v > 10)) return null;
  
  // Store encrypted allocation
  if (!encryptedAllocations.has(gameId)) {
    encryptedAllocations.set(gameId, new Map());
  }
  encryptedAllocations.get(gameId)!.set(player, allocation);
  
  // Update game state
  if (player === game.creator) {
    game.creatorAllocation = allocation;
  } else if (player === game.opponent) {
    game.opponentAllocation = allocation;
  } else {
    return null;
  }
  
  // Check if both have allocated
  if (game.creatorAllocation && game.opponentAllocation) {
    game.status = 'revealing';
    game.currentRound = 1;
  } else {
    game.status = 'allocated';
  }
  
  games.set(gameId, game);
  return game;
}

export function revealNextRound(gameId: string): ShadowDuelGame | null {
  const game = games.get(gameId);
  if (!game || game.status !== 'revealing') return null;
  if (!game.creatorAllocation || !game.opponentAllocation) return null;
  
  const roundIndex = game.currentRound - 1;
  if (roundIndex >= 3) return null;
  
  const creatorPower = game.creatorAllocation[roundIndex];
  const opponentPower = game.opponentAllocation[roundIndex];
  
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
    // Ties don't count
  }
  
  if (creatorWins > opponentWins) return game.creator;
  if (opponentWins > creatorWins) return game.opponent;
  
  // If tied on wins, compare total power used in won rounds
  return Math.random() > 0.5 ? game.creator : game.opponent;
}

export function getGame(gameId: string): ShadowDuelGame | null {
  return games.get(gameId) || null;
}

export function getOpenGames(): GameLobbyItem[] {
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
  const playerGames: ShadowDuelGame[] = [];
  
  games.forEach((game) => {
    if (game.creator === player || game.opponent === player) {
      playerGames.push(game);
    }
  });
  
  return playerGames.sort((a, b) => b.createdAt - a.createdAt);
}

export function formatStake(lamports: number): string {
  return (lamports / LAMPORTS_PER_SOL).toFixed(4);
}

export function parseStake(sol: string): number {
  return Math.floor(parseFloat(sol) * LAMPORTS_PER_SOL);
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

// Simulate blockchain transaction for game actions
export async function executeGameTransaction(
  connection: Connection,
  player: PublicKey,
  action: 'create' | 'join' | 'settle'
): Promise<string> {
  // In production: actual on-chain transaction
  // For demo: return simulated signature
  await new Promise(resolve => setTimeout(resolve, 500));
  return `shadow_tx_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}
