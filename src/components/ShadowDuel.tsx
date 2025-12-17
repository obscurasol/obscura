'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
  ShadowDuelGame, 
  createGame, 
  joinGame, 
  submitAllocation, 
  revealNextRound,
  getGame,
  formatStake,
  parseStake,
  shortenAddress
} from '@/lib/games';

interface ShadowDuelProps {
  gameId?: string;
  onBack: () => void;
}

export function ShadowDuel({ gameId, onBack }: ShadowDuelProps) {
  const { publicKey } = useWallet();
  const [game, setGame] = useState<ShadowDuelGame | null>(null);
  const [stake, setStake] = useState('0.01');
  const [allocation, setAllocation] = useState<number[]>([3, 3, 4]);
  const [isCreating, setIsCreating] = useState(!gameId);
  const [error, setError] = useState('');
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    if (gameId) {
      const existingGame = getGame(gameId);
      setGame(existingGame);
      setIsCreating(false);
    }
  }, [gameId]);

  const totalAllocation = allocation.reduce((a, b) => a + b, 0);
  const isValidAllocation = totalAllocation === 10 && allocation.every(v => v >= 0 && v <= 10);

  const handleAllocationChange = (index: number, value: number) => {
    const newAllocation = [...allocation];
    newAllocation[index] = Math.max(0, Math.min(10, value));
    setAllocation(newAllocation);
  };

  const handleCreateGame = () => {
    if (!publicKey) return;
    setError('');
    
    const stakeAmount = parseStake(stake);
    if (stakeAmount <= 0) {
      setError('Invalid stake amount');
      return;
    }

    const newGame = createGame(publicKey.toString(), stakeAmount);
    setGame(newGame);
    setIsCreating(false);
  };

  const handleJoinGame = () => {
    if (!publicKey || !game) return;
    setError('');

    const updatedGame = joinGame(game.id, publicKey.toString());
    if (!updatedGame) {
      setError('Failed to join game');
      return;
    }
    setGame(updatedGame);
  };

  const handleSubmitAllocation = () => {
    if (!publicKey || !game || !isValidAllocation) return;
    setError('');

    const updatedGame = submitAllocation(game.id, publicKey.toString(), allocation);
    if (!updatedGame) {
      setError('Failed to submit allocation');
      return;
    }
    setGame(updatedGame);
  };

  const handleRevealRound = async () => {
    if (!game) return;
    setIsRevealing(true);
    
    // Dramatic delay for reveal
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
  const hasSubmitted = isCreator ? !!game?.creatorAllocation : !!game?.opponentAllocation;

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
              Opponent will match your stake. Winner takes {parseFloat(stake) * 2} SOL.
            </p>
          </div>

          {error && (
            <p className="text-red-400 font-mono text-sm">{error}</p>
          )}

          <button
            onClick={handleCreateGame}
            className="w-full bg-stone-100 text-stone-900 py-3 font-mono hover:bg-stone-200 transition-colors"
          >
            Create Duel
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
          <p className="text-stone-500 font-mono text-sm mt-1">
            {game.id}
          </p>
        </div>
        <div className="text-right">
          <p className="text-stone-400 font-mono text-sm">Stake</p>
          <p className="text-stone-100 font-mono text-xl">{formatStake(game.stake)} SOL</p>
          <p className="text-stone-500 font-mono text-sm">Pot: {formatStake(game.stake * 2)} SOL</p>
        </div>
      </div>

      {/* Players */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className={`border p-4 ${isCreator ? 'border-stone-400 bg-stone-800/50' : 'border-stone-700'}`}>
          <p className="text-stone-500 font-mono text-xs mb-1">CREATOR</p>
          <p className="text-stone-100 font-mono">{shortenAddress(game.creator)}</p>
          {game.creatorAllocation && <p className="text-green-500 font-mono text-xs mt-1">READY</p>}
        </div>
        <div className={`border p-4 ${isOpponent ? 'border-stone-400 bg-stone-800/50' : 'border-stone-700'}`}>
          <p className="text-stone-500 font-mono text-xs mb-1">OPPONENT</p>
          {game.opponent ? (
            <>
              <p className="text-stone-100 font-mono">{shortenAddress(game.opponent)}</p>
              {game.opponentAllocation && <p className="text-green-500 font-mono text-xs mt-1">READY</p>}
            </>
          ) : (
            <p className="text-stone-500 font-mono">Waiting...</p>
          )}
        </div>
      </div>

      {/* Game Status */}
      {game.status === 'waiting' && !isCreator && (
        <button
          onClick={handleJoinGame}
          className="w-full bg-stone-100 text-stone-900 py-3 font-mono hover:bg-stone-200 transition-colors mb-6"
        >
          Join Duel ({formatStake(game.stake)} SOL)
        </button>
      )}

      {game.status === 'waiting' && isCreator && (
        <div className="border border-stone-700 bg-stone-800/50 p-4 mb-6 text-center">
          <p className="text-stone-400 font-mono">Waiting for opponent to join...</p>
          <p className="text-stone-500 font-mono text-sm mt-2">Share game ID: {game.id}</p>
        </div>
      )}

      {/* Allocation Phase */}
      {(game.status === 'joined' || game.status === 'allocated') && isPlayer && !hasSubmitted && (
        <div className="mb-6">
          <h3 className="font-serif text-lg text-stone-100 mb-4">Allocate Your Power</h3>
          <p className="text-stone-400 font-mono text-sm mb-4">
            Distribute 10 power points across 3 rounds. Higher power wins the round.
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

          {error && (
            <p className="text-red-400 font-mono text-sm mb-4">{error}</p>
          )}

          <button
            onClick={handleSubmitAllocation}
            disabled={!isValidAllocation}
            className="w-full bg-stone-100 text-stone-900 py-3 font-mono hover:bg-stone-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Lock In Allocation
          </button>
        </div>
      )}

      {/* Waiting for opponent allocation */}
      {game.status === 'allocated' && hasSubmitted && (
        <div className="border border-stone-700 bg-stone-800/50 p-4 mb-6 text-center">
          <p className="text-stone-400 font-mono">Your allocation is encrypted.</p>
          <p className="text-stone-500 font-mono text-sm mt-2">Waiting for opponent...</p>
        </div>
      )}

      {/* Reveal Phase */}
      {game.status === 'revealing' && (
        <div className="mb-6">
          <h3 className="font-serif text-lg text-stone-100 mb-4">The Reveal</h3>
          
          {/* Revealed Rounds */}
          <div className="space-y-4 mb-6">
            {game.revealedRounds.map((round, index) => {
              const creatorWon = round.creator > round.opponent;
              const opponentWon = round.opponent > round.creator;
              const tie = round.creator === round.opponent;
              
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
                    <div className="text-center text-stone-500 font-mono">
                      {tie ? 'TIE' : 'VS'}
                    </div>
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
                  <div className="text-center text-stone-600 font-mono">
                    VS
                  </div>
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
            {game.winner === publicKey.toString() ? (
              <>
                <p className="font-serif text-3xl text-green-500 mb-2">VICTORY</p>
                <p className="text-stone-400 font-mono">You claimed {formatStake(game.stake * 2)} SOL</p>
              </>
            ) : (
              <>
                <p className="font-serif text-3xl text-red-500 mb-2">DEFEAT</p>
                <p className="text-stone-400 font-mono">Your opponent claims the pot</p>
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

          <button
            onClick={onBack}
            className="w-full border border-stone-600 text-stone-300 py-3 font-mono hover:bg-stone-800 transition-colors"
          >
            Back to Lobby
          </button>
        </div>
      )}
    </div>
  );
}

