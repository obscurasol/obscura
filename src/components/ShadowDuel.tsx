'use client';

import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { 
  ShadowDuelGame, 
  createGame, 
  joinGame, 
  submitCommitment,
  submitReveal,
  revealNextRound,
  getGame,
  formatStake,
  parseStake,
  shortenAddress,
  generateSecret,
  createCommitment,
  createStakeTransaction,
  updateGameTx
} from '@/lib/games';

interface ShadowDuelProps {
  gameId?: string;
  onBack: () => void;
}

export function ShadowDuel({ gameId, onBack }: ShadowDuelProps) {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [game, setGame] = useState<ShadowDuelGame | null>(null);
  const [stake, setStake] = useState('0.01');
  const [allocation, setAllocation] = useState<number[]>([3, 3, 4]);
  const [secret, setSecret] = useState<string>('');
  const [isCreating, setIsCreating] = useState(!gameId);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  
  // Store secret locally for this game
  const [localSecrets, setLocalSecrets] = useState<Record<string, string>>({});

  useEffect(() => {
    if (gameId) {
      const existingGame = getGame(gameId);
      setGame(existingGame);
      setIsCreating(false);
    }
    
    // Load secrets from localStorage
    const stored = localStorage.getItem('obscura_secrets');
    if (stored) {
      setLocalSecrets(JSON.parse(stored));
    }
  }, [gameId]);

  // Poll for game updates
  useEffect(() => {
    if (!game?.id) return;
    
    const interval = setInterval(() => {
      const updated = getGame(game.id);
      if (updated) {
        setGame(updated);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [game?.id]);

  const saveSecret = (gameId: string, secret: string) => {
    const updated = { ...localSecrets, [gameId]: secret };
    setLocalSecrets(updated);
    localStorage.setItem('obscura_secrets', JSON.stringify(updated));
  };

  const totalAllocation = allocation.reduce((a, b) => a + b, 0);
  const isValidAllocation = totalAllocation === 10 && allocation.every(v => v >= 0 && v <= 10);

  const handleAllocationChange = (index: number, value: number) => {
    const newAllocation = [...allocation];
    newAllocation[index] = Math.max(0, Math.min(10, value));
    setAllocation(newAllocation);
  };

  const handleCreateGame = async () => {
    if (!publicKey || !signTransaction) return;
    setError('');
    setIsProcessing(true);
    
    try {
      const stakeAmount = parseStake(stake);
      if (stakeAmount <= 0) {
        setError('Invalid stake amount');
        return;
      }

      // Create stake transaction (proof of stake)
      const tx = await createStakeTransaction(connection, publicKey, stakeAmount);
      const signed = await signTransaction(tx);
      const sig = await connection.sendRawTransaction(signed.serialize());
      
      // Create game
      const newGame = createGame(publicKey.toString(), stakeAmount);
      updateGameTx(newGame.id, 'createTx', sig);
      
      setGame(newGame);
      setIsCreating(false);
    } catch (e: any) {
      setError(e.message || 'Failed to create game');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleJoinGame = async () => {
    if (!publicKey || !signTransaction || !game) return;
    setError('');
    setIsProcessing(true);

    try {
      // Create stake transaction
      const tx = await createStakeTransaction(connection, publicKey, game.stake);
      const signed = await signTransaction(tx);
      const sig = await connection.sendRawTransaction(signed.serialize());

      const updatedGame = joinGame(game.id, publicKey.toString());
      if (!updatedGame) {
        setError('Failed to join game');
        return;
      }
      
      updateGameTx(game.id, 'joinTx', sig);
      setGame(updatedGame);
    } catch (e: any) {
      setError(e.message || 'Failed to join game');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCommit = async () => {
    if (!publicKey || !game || !isValidAllocation) return;
    setError('');
    setIsProcessing(true);

    try {
      // Generate secret and create commitment
      const newSecret = generateSecret();
      const commitment = await createCommitment(allocation, newSecret);
      
      // Save secret locally (needed for reveal)
      saveSecret(game.id, newSecret);
      
      // Submit commitment
      const updatedGame = submitCommitment(game.id, publicKey.toString(), commitment);
      if (!updatedGame) {
        setError('Failed to submit commitment');
        return;
      }
      
      setGame(updatedGame);
    } catch (e: any) {
      setError(e.message || 'Failed to commit');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReveal = async () => {
    if (!publicKey || !game) return;
    setError('');
    setIsProcessing(true);

    try {
      // Get saved secret
      const savedSecret = localSecrets[game.id];
      if (!savedSecret) {
        setError('Secret not found - did you commit from this browser?');
        return;
      }

      const result = await submitReveal(
        game.id,
        publicKey.toString(),
        allocation,
        savedSecret
      );

      if (!result.success) {
        setError(result.error || 'Failed to reveal');
        return;
      }

      setGame(result.game);
    } catch (e: any) {
      setError(e.message || 'Failed to reveal');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRevealRound = async () => {
    if (!game) return;
    setIsRevealing(true);
    
    // Dramatic delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const updatedGame = revealNextRound(game.id);
    if (updatedGame) {
      setGame(updatedGame);
    }
    setIsRevealing(false);
  };

  const isCreator = publicKey?.toString() === game?.creator;
  const isOpponent = publicKey?.toString() === game?.opponent;
  const isPlayer = isCreator || isOpponent;
  
  const hasCommitted = isCreator ? !!game?.creatorCommit : !!game?.opponentCommit;
  const hasRevealed = isCreator ? !!game?.creatorReveal : !!game?.opponentReveal;

  if (!publicKey) {
    return (
      <div className="border border-stone-700 bg-stone-900/50 p-8 text-center">
        <p className="text-stone-400 font-mono">Connect wallet to play</p>
      </div>
    );
  }

  // Create game view
  if (isCreating) {
    return (
      <div className="border border-stone-700 bg-stone-900/50 p-8">
        <button 
          onClick={onBack}
          className="text-stone-500 hover:text-stone-300 font-mono text-sm mb-6"
        >
          &lt;- Back to Lobby
        </button>
        
        <h2 className="font-serif text-2xl text-stone-100 mb-6">Create Shadow Duel</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-stone-400 font-mono text-sm mb-2">
              Stake Amount (SOL)
            </label>
            <input
              type="number"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              step="0.01"
              min="0.001"
              className="w-full bg-stone-800 border border-stone-600 px-4 py-3 text-stone-100 font-mono focus:border-stone-400 focus:outline-none"
              placeholder="0.01"
            />
          </div>

          <div className="border border-stone-700 bg-stone-800/50 p-4">
            <p className="text-stone-400 font-mono text-sm">
              Opponent will match your stake. Winner takes {(parseFloat(stake) * 2).toFixed(4)} SOL.
            </p>
          </div>

          <div className="border border-green-900/50 bg-green-900/20 p-4">
            <p className="text-green-400 font-mono text-xs mb-2">COMMIT-REVEAL PRIVACY</p>
            <p className="text-stone-400 font-mono text-sm">
              Your allocation is cryptographically hidden until both players reveal. 
              No one can see your strategy - not even the blockchain.
            </p>
          </div>

          {error && (
            <p className="text-red-400 font-mono text-sm">{error}</p>
          )}

          <button
            onClick={handleCreateGame}
            disabled={isProcessing}
            className="w-full bg-stone-100 text-stone-900 py-3 font-mono hover:bg-stone-200 transition-colors disabled:opacity-50"
          >
            {isProcessing ? 'Creating...' : 'Create Duel'}
          </button>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="border border-stone-700 bg-stone-900/50 p-8 text-center">
        <p className="text-stone-400 font-mono">Game not found</p>
        <button 
          onClick={onBack}
          className="text-stone-500 hover:text-stone-300 font-mono text-sm mt-4"
        >
          Back to Lobby
        </button>
      </div>
    );
  }

  return (
    <div className="border border-stone-700 bg-stone-900/50 p-8">
      <button 
        onClick={onBack}
        className="text-stone-500 hover:text-stone-300 font-mono text-sm mb-6"
      >
        &lt;- Back to Lobby
      </button>

      {/* Game Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="font-serif text-2xl text-stone-100">Shadow Duel</h2>
          <p className="text-stone-500 font-mono text-xs mt-1 break-all">
            {game.id}
          </p>
        </div>
        <div className="text-right">
          <p className="text-stone-400 font-mono text-sm">Stake</p>
          <p className="text-stone-100 font-mono text-xl">{formatStake(game.stake)} SOL</p>
          <p className="text-stone-500 font-mono text-sm">Pot: {formatStake(game.stake * 2)} SOL</p>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-6">
        <span className={`font-mono text-xs px-3 py-1 ${
          game.status === 'waiting' ? 'bg-yellow-900/50 text-yellow-500' :
          game.status === 'committing' ? 'bg-blue-900/50 text-blue-400' :
          game.status === 'revealing' ? 'bg-purple-900/50 text-purple-400' :
          game.status === 'showdown' ? 'bg-orange-900/50 text-orange-400' :
          'bg-green-900/50 text-green-400'
        }`}>
          {game.status.toUpperCase()}
        </span>
      </div>

      {/* Players */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className={`border p-4 ${isCreator ? 'border-stone-400 bg-stone-800/50' : 'border-stone-700'}`}>
          <p className="text-stone-500 font-mono text-xs mb-1">CREATOR</p>
          <p className="text-stone-100 font-mono text-sm">{shortenAddress(game.creator)}</p>
          {game.creatorCommit && <p className="text-blue-400 font-mono text-xs mt-1">COMMITTED</p>}
          {game.creatorReveal && <p className="text-green-500 font-mono text-xs mt-1">REVEALED</p>}
        </div>
        <div className={`border p-4 ${isOpponent ? 'border-stone-400 bg-stone-800/50' : 'border-stone-700'}`}>
          <p className="text-stone-500 font-mono text-xs mb-1">OPPONENT</p>
          {game.opponent ? (
            <>
              <p className="text-stone-100 font-mono text-sm">{shortenAddress(game.opponent)}</p>
              {game.opponentCommit && <p className="text-blue-400 font-mono text-xs mt-1">COMMITTED</p>}
              {game.opponentReveal && <p className="text-green-500 font-mono text-xs mt-1">REVEALED</p>}
            </>
          ) : (
            <p className="text-stone-500 font-mono text-sm">Waiting...</p>
          )}
        </div>
      </div>

      {/* Waiting for opponent */}
      {game.status === 'waiting' && !isCreator && (
        <button
          onClick={handleJoinGame}
          disabled={isProcessing}
          className="w-full bg-stone-100 text-stone-900 py-3 font-mono hover:bg-stone-200 transition-colors disabled:opacity-50 mb-6"
        >
          {isProcessing ? 'Joining...' : `Join Duel (${formatStake(game.stake)} SOL)`}
        </button>
      )}

      {game.status === 'waiting' && isCreator && (
        <div className="border border-stone-700 bg-stone-800/50 p-4 mb-6 text-center">
          <p className="text-stone-400 font-mono">Waiting for opponent to join...</p>
          <p className="text-stone-500 font-mono text-xs mt-2 break-all">Share ID: {game.id}</p>
        </div>
      )}

      {/* Commit Phase */}
      {game.status === 'committing' && isPlayer && !hasCommitted && (
        <div className="mb-6">
          <h3 className="font-serif text-lg text-stone-100 mb-4">Lock In Your Strategy</h3>
          <p className="text-stone-400 font-mono text-sm mb-4">
            Distribute 10 power points. Your allocation will be cryptographically hidden.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-4">
            {['I', 'II', 'III'].map((numeral, index) => (
              <div key={index} className="border border-stone-700 p-4">
                <p className="text-stone-500 font-mono text-xs mb-2">ROUND {numeral}</p>
                <input
                  type="number"
                  value={allocation[index]}
                  onChange={(e) => handleAllocationChange(index, parseInt(e.target.value) || 0)}
                  min="0"
                  max="10"
                  className="w-full bg-stone-800 border border-stone-600 px-3 py-2 text-stone-100 font-mono text-center text-xl focus:border-stone-400 focus:outline-none"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="text-stone-400 font-mono">Total:</span>
            <span className={`font-mono text-xl ${isValidAllocation ? 'text-green-500' : 'text-red-500'}`}>
              {totalAllocation}/10
            </span>
          </div>

          <div className="border border-blue-900/50 bg-blue-900/20 p-3 mb-4">
            <p className="text-blue-400 font-mono text-xs">
              HASH COMMITMENT: Your allocation is hashed with a secret. Only you can reveal it later.
            </p>
          </div>

          {error && <p className="text-red-400 font-mono text-sm mb-4">{error}</p>}

          <button
            onClick={handleCommit}
            disabled={!isValidAllocation || isProcessing}
            className="w-full bg-stone-100 text-stone-900 py-3 font-mono hover:bg-stone-200 transition-colors disabled:opacity-50"
          >
            {isProcessing ? 'Committing...' : 'Commit Allocation'}
          </button>
        </div>
      )}

      {/* Waiting for other player to commit */}
      {game.status === 'committing' && hasCommitted && (
        <div className="border border-stone-700 bg-stone-800/50 p-4 mb-6 text-center">
          <p className="text-green-400 font-mono mb-2">Your allocation is locked and hidden.</p>
          <p className="text-stone-500 font-mono text-sm">Waiting for opponent to commit...</p>
        </div>
      )}

      {/* Reveal Phase */}
      {game.status === 'revealing' && isPlayer && !hasRevealed && (
        <div className="mb-6">
          <h3 className="font-serif text-lg text-stone-100 mb-4">Reveal Your Allocation</h3>
          <p className="text-stone-400 font-mono text-sm mb-4">
            Both players have committed. Now reveal to prove your allocation.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-4">
            {['I', 'II', 'III'].map((numeral, index) => (
              <div key={index} className="border border-stone-600 bg-stone-800/50 p-4">
                <p className="text-stone-500 font-mono text-xs mb-2">ROUND {numeral}</p>
                <p className="text-stone-100 font-mono text-center text-xl">{allocation[index]}</p>
              </div>
            ))}
          </div>

          {error && <p className="text-red-400 font-mono text-sm mb-4">{error}</p>}

          <button
            onClick={handleReveal}
            disabled={isProcessing}
            className="w-full bg-stone-100 text-stone-900 py-3 font-mono hover:bg-stone-200 transition-colors disabled:opacity-50"
          >
            {isProcessing ? 'Revealing...' : 'Reveal Allocation'}
          </button>
        </div>
      )}

      {/* Waiting for other player to reveal */}
      {game.status === 'revealing' && hasRevealed && (
        <div className="border border-stone-700 bg-stone-800/50 p-4 mb-6 text-center">
          <p className="text-green-400 font-mono mb-2">Your allocation revealed.</p>
          <p className="text-stone-500 font-mono text-sm">Waiting for opponent to reveal...</p>
        </div>
      )}

      {/* Showdown Phase */}
      {game.status === 'showdown' && (
        <div className="mb-6">
          <h3 className="font-serif text-lg text-stone-100 mb-4">The Showdown</h3>
          
          {/* Revealed Rounds */}
          <div className="space-y-4 mb-6">
            {game.revealedRounds.map((round, index) => {
              const creatorWon = round.creator > round.opponent;
              const opponentWon = round.opponent > round.creator;
              
              return (
                <div key={index} className="border border-stone-600 bg-stone-800/50 p-4">
                  <p className="text-stone-500 font-mono text-xs mb-2">
                    ROUND {['I', 'II', 'III'][index]}
                  </p>
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className={`text-center ${creatorWon ? 'text-green-500' : 'text-stone-400'}`}>
                      <p className="font-mono text-2xl">{round.creator}</p>
                      <p className="font-mono text-xs">{shortenAddress(game.creator)}</p>
                    </div>
                    <div className="text-center text-stone-500 font-mono">VS</div>
                    <div className={`text-center ${opponentWon ? 'text-green-500' : 'text-stone-400'}`}>
                      <p className="font-mono text-2xl">{round.opponent}</p>
                      <p className="font-mono text-xs">{shortenAddress(game.opponent!)}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Unrevealed Rounds */}
            {Array.from({ length: 3 - game.revealedRounds.length }).map((_, index) => (
              <div key={`unrevealed-${index}`} className="border border-stone-700 bg-stone-900/50 p-4">
                <p className="text-stone-500 font-mono text-xs mb-2">
                  ROUND {['I', 'II', 'III'][game.revealedRounds.length + index]}
                </p>
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="text-center text-stone-600">
                    <p className="font-mono text-2xl">?</p>
                  </div>
                  <div className="text-center text-stone-600 font-mono">VS</div>
                  <div className="text-center text-stone-600">
                    <p className="font-mono text-2xl">?</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {game.currentRound <= 3 && (
            <button
              onClick={handleRevealRound}
              disabled={isRevealing}
              className="w-full bg-stone-100 text-stone-900 py-3 font-mono hover:bg-stone-200 transition-colors disabled:opacity-50"
            >
              {isRevealing ? 'Revealing...' : `Reveal Round ${['I', 'II', 'III'][game.currentRound - 1]}`}
            </button>
          )}
        </div>
      )}

      {/* Game Complete */}
      {game.status === 'completed' && (
        <div className="text-center">
          <div className="border border-stone-600 bg-stone-800/50 p-6 mb-6">
            {game.winner === publicKey?.toString() ? (
              <>
                <p className="font-serif text-3xl text-green-500 mb-2">VICTORY</p>
                <p className="text-stone-400 font-mono">You won {formatStake(game.stake * 2)} SOL</p>
              </>
            ) : (
              <>
                <p className="font-serif text-3xl text-red-500 mb-2">DEFEAT</p>
                <p className="text-stone-400 font-mono">Opponent takes the pot</p>
              </>
            )}
          </div>

          {/* Final Results */}
          <div className="space-y-2 mb-6">
            {game.revealedRounds.map((round, index) => {
              const creatorWon = round.creator > round.opponent;
              const opponentWon = round.opponent > round.creator;
              
              return (
                <div key={index} className="flex justify-between text-stone-400 font-mono text-sm">
                  <span>Round {['I', 'II', 'III'][index]}</span>
                  <span>{round.creator} vs {round.opponent}</span>
                  <span className={creatorWon ? 'text-green-500' : opponentWon ? 'text-red-500' : 'text-stone-500'}>
                    {creatorWon ? 'Creator' : opponentWon ? 'Opponent' : 'Tie'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="border border-green-900/50 bg-green-900/20 p-3 mb-6">
            <p className="text-green-400 font-mono text-xs">
              VERIFIED: All allocations cryptographically proven via commit-reveal
            </p>
          </div>

          <button
            onClick={onBack}
            className="w-full border border-stone-600 text-stone-300 py-3 font-mono hover:bg-stone-800 transition-colors"
          >
            Back to Lobby
          </button>
        </div>
      )}

      {error && game.status !== 'committing' && game.status !== 'revealing' && (
        <p className="text-red-400 font-mono text-sm mt-4">{error}</p>
      )}
    </div>
  );
}
