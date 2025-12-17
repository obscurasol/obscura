'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ShadowDuel } from '@/components/ShadowDuel';
import { getOpenGames, getPlayerGames, getGame, formatStake, shortenAddress, GameLobbyItem, ShadowDuelGame } from '@/lib/games';

export default function GamesPage() {
  const { publicKey } = useWallet();
  const [view, setView] = useState<'lobby' | 'create' | 'game'>('lobby');
  const [selectedGameId, setSelectedGameId] = useState<string | undefined>();
  const [openGames, setOpenGames] = useState<GameLobbyItem[]>([]);
  const [myGames, setMyGames] = useState<ShadowDuelGame[]>([]);
  const [joinId, setJoinId] = useState('');
  const [joinError, setJoinError] = useState('');

  useEffect(() => {
    refreshGames();
    const interval = setInterval(refreshGames, 3000);
    return () => clearInterval(interval);
    
  }, [publicKey]);

  // Check URL for game ID on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const gameId = params.get('join');
      if (gameId) {
        handleJoinById(gameId);
      }
    }
  }, []);

  const refreshGames = () => {
    setOpenGames(getOpenGames());
    if (publicKey) {
      setMyGames(getPlayerGames(publicKey.toString()));
    }
  };

  const handleSelectGame = (gameId: string) => {
    setSelectedGameId(gameId);
    setView('game');
  };

  const handleCreateGame = () => {
    setSelectedGameId(undefined);
    setView('create');
  };

  const handleBackToLobby = () => {
    setView('lobby');
    setSelectedGameId(undefined);
    refreshGames();
    // Clear URL params
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', '/games');
    }
  };

  const handleJoinById = (id: string) => {
    setJoinError('');
    const trimmedId = id.trim();
    if (!trimmedId) {
      setJoinError('Please enter a game ID');
      return;
    }
    
    // Try to get the game (it might exist in another browser's localStorage)
    // For now, we'll navigate to the game and let ShadowDuel handle it
    setSelectedGameId(trimmedId);
    setView('game');
  };

  const copyGameLink = (gameId: string) => {
    const link = `${window.location.origin}/games?join=${gameId}`;
    navigator.clipboard.writeText(link);
    alert('Game link copied! Share it with your opponent.');
  };

  return (
    <main className="min-h-screen pt-24 pb-16 relative z-10">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-stone-100 mb-4">
            Shadow Duel
          </h1>
          <p className="text-stone-400 font-mono max-w-xl mx-auto">
            Strategic hidden-state combat. Allocate power across three rounds.
            Outmaneuver your opponent. Winner takes all.
          </p>
        </div>

        {/* Wallet Connection */}
        {!publicKey && (
          <div className="border border-stone-700 bg-stone-900/50 p-8 text-center mb-8">
            <p className="text-stone-400 font-mono mb-4">Connect your wallet to play</p>
            <div className="flex justify-center mb-4">
              <WalletMultiButton />
            </div>
            <p className="text-stone-600 font-mono text-xs">
              Need a wallet?{' '}
              <a 
                href="https://phantom.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-stone-500 hover:text-stone-400 underline"
              >
                Get Phantom
              </a>
            </p>
          </div>
        )}

        {/* Game View */}
        {view === 'game' || view === 'create' ? (
          <ShadowDuel 
            gameId={selectedGameId} 
            onBack={handleBackToLobby}
          />
        ) : (
          <>
            {/* How to Play */}
            <div className="border border-stone-700 bg-stone-900/50 p-6 mb-8">
              <h2 className="font-serif text-xl text-stone-100 mb-4">How to Play</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-stone-500 font-mono text-xs mb-2">I. STAKE</p>
                  <p className="text-stone-300 font-mono text-sm">
                    Creator sets stake. Opponent matches. Winner takes the pot.
                  </p>
                </div>
                <div>
                  <p className="text-stone-500 font-mono text-xs mb-2">II. ALLOCATE</p>
                  <p className="text-stone-300 font-mono text-sm">
                    Secretly distribute 10 power points across 3 rounds.
                  </p>
                </div>
                <div>
                  <p className="text-stone-500 font-mono text-xs mb-2">III. REVEAL</p>
                  <p className="text-stone-300 font-mono text-sm">
                    Rounds reveal one by one. Win 2 of 3 to claim victory.
                  </p>
                </div>
              </div>
            </div>

            {/* Create Game Button */}
            {publicKey && (
              <button
                onClick={handleCreateGame}
                className="w-full bg-stone-100 text-stone-900 py-4 font-mono text-lg hover:bg-stone-200 transition-colors mb-4"
              >
                Create New Duel
              </button>
            )}

            {/* Join by ID */}
            {publicKey && (
              <div className="border border-stone-700 bg-stone-900/50 p-4 mb-8">
                <p className="text-stone-400 font-mono text-sm mb-3">Join Existing Duel</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={joinId}
                    onChange={(e) => setJoinId(e.target.value)}
                    placeholder="Paste game ID or link..."
                    className="flex-1 bg-stone-800 border border-stone-600 px-3 py-2 text-stone-100 font-mono text-sm focus:border-stone-400 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      // Extract ID from link if needed
                      let id = joinId;
                      if (joinId.includes('join=')) {
                        const match = joinId.match(/join=([^&]+)/);
                        if (match) id = match[1];
                      }
                      handleJoinById(id);
                    }}
                    className="bg-stone-700 text-stone-100 px-4 py-2 font-mono text-sm hover:bg-stone-600 transition-colors"
                  >
                    Join
                  </button>
                </div>
                {joinError && (
                  <p className="text-red-400 font-mono text-xs mt-2">{joinError}</p>
                )}
              </div>
            )}

            {/* My Active Games */}
            {publicKey && myGames.length > 0 && (
              <div className="mb-8">
                <h2 className="font-serif text-xl text-stone-100 mb-4">My Games</h2>
                <div className="space-y-3">
                  {myGames.filter(g => g.status !== 'completed').map((game) => (
                    <div
                      key={game.id}
                      className="border border-stone-600 bg-stone-800/50 p-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="text-stone-100 font-mono">{formatStake(game.stake)} SOL</p>
                          <p className="text-stone-500 font-mono text-xs mt-1">
                            vs {game.opponent ? shortenAddress(game.opponent) : 'Waiting for opponent...'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`font-mono text-xs px-2 py-1 ${
                            game.status === 'waiting' ? 'bg-yellow-900/50 text-yellow-500' :
                            game.status === 'committing' ? 'bg-blue-900/50 text-blue-400' :
                            game.status === 'revealing' ? 'bg-purple-900/50 text-purple-400' :
                            game.status === 'showdown' ? 'bg-orange-900/50 text-orange-400' :
                            'bg-stone-700 text-stone-400'
                          }`}>
                            {game.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSelectGame(game.id)}
                          className="flex-1 bg-stone-700 text-stone-100 py-2 font-mono text-sm hover:bg-stone-600 transition-colors"
                        >
                          {game.status === 'waiting' ? 'View' : 'Continue'}
                        </button>
                        {game.status === 'waiting' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyGameLink(game.id);
                            }}
                            className="bg-stone-600 text-stone-100 px-3 py-2 font-mono text-sm hover:bg-stone-500 transition-colors"
                          >
                            Copy Link
                          </button>
                        )}
                      </div>
                      {game.status === 'waiting' && (
                        <p className="text-stone-600 font-mono text-xs mt-2 break-all">
                          ID: {game.id}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Open Games Lobby */}
            <div>
              <h2 className="font-serif text-xl text-stone-100 mb-4">Open Duels</h2>
              {openGames.length === 0 ? (
                <div className="border border-stone-700 bg-stone-900/50 p-8 text-center">
                  <p className="text-stone-500 font-mono">No open games. Create one to start.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {openGames.filter(g => g.creator !== publicKey?.toString()).map((game) => (
                    <button
                      key={game.id}
                      onClick={() => handleSelectGame(game.id)}
                      className="w-full border border-stone-700 bg-stone-900/50 p-4 text-left hover:border-stone-400 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-stone-100 font-mono">{formatStake(game.stake)} SOL</p>
                          <p className="text-stone-500 font-mono text-xs mt-1">
                            Created by {shortenAddress(game.creator)}
                          </p>
                        </div>
                        <div className="text-stone-400 font-mono text-sm">
                          Join &rarr;
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Game History */}
            {publicKey && myGames.filter(g => g.status === 'completed').length > 0 && (
              <div className="mt-8">
                <h2 className="font-serif text-xl text-stone-100 mb-4">History</h2>
                <div className="space-y-2">
                  {myGames.filter(g => g.status === 'completed').slice(0, 5).map((game) => {
                    const won = game.winner === publicKey.toString();
                    return (
                      <div
                        key={game.id}
                        className="border border-stone-800 bg-stone-900/30 p-3 flex justify-between items-center"
                      >
                        <div>
                          <p className="text-stone-400 font-mono text-sm">
                            vs {shortenAddress(game.creator === publicKey.toString() ? game.opponent! : game.creator)}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-stone-500 font-mono text-sm">
                            {formatStake(game.stake)} SOL
                          </span>
                          <span className={`font-mono text-sm ${won ? 'text-green-500' : 'text-red-500'}`}>
                            {won ? '+' : '-'}{formatStake(game.stake)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* Powered by Arcium */}
        <div className="mt-12 text-center">
          <p className="text-stone-600 font-mono text-xs">
            Encrypted state powered by Arcium MPC
          </p>
        </div>
      </div>
    </main>
  );
}

