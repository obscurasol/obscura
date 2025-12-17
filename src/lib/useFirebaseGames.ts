'use client';

import { useState, useEffect, useCallback } from 'react';
import { database, ref, set, onValue, remove } from './firebase';
import { ShadowDuelGame } from './games';

export function useFirebaseGames() {
  const [games, setGames] = useState<Record<string, ShadowDuelGame>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Mark as mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for all games
  useEffect(() => {
    if (!mounted || !database) {
      return;
    }

    try {
      const gamesRef = ref(database, 'games');
      const unsubscribe = onValue(gamesRef, (snapshot) => {
        const data = snapshot.val();
        setGames(data || {});
        setIsConnected(true);
        setError(null);
      }, (err) => {
        console.error('Firebase error:', err);
        setError('Failed to connect to game server');
        setIsConnected(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Firebase init error:', err);
      setError('Game server not configured');
      setIsConnected(false);
    }
  }, [mounted]);

  // Save game to Firebase
  const saveGame = useCallback(async (game: ShadowDuelGame) => {
    if (!database) return false;
    try {
      const gameRef = ref(database, `games/${game.id}`);
      await set(gameRef, game);
      return true;
    } catch (err) {
      console.error('Save error:', err);
      return false;
    }
  }, []);

  // Get specific game
  const getGameById = useCallback((gameId: string): ShadowDuelGame | null => {
    return games[gameId] || null;
  }, [games]);

  // Get open games (waiting for opponent)
  const getOpenGames = useCallback(() => {
    return Object.values(games).filter(g => g.status === 'waiting');
  }, [games]);

  // Get all active games for a player
  const getPlayerGames = useCallback((playerAddress: string) => {
    return Object.values(games).filter(g => 
      g.creator === playerAddress || g.opponent === playerAddress
    );
  }, [games]);

  // Delete game
  const deleteGame = useCallback(async (gameId: string) => {
    if (!database) return false;
    try {
      const gameRef = ref(database, `games/${gameId}`);
      await remove(gameRef);
      return true;
    } catch (err) {
      console.error('Delete error:', err);
      return false;
    }
  }, []);

  return {
    games,
    isConnected,
    error,
    saveGame,
    getGameById,
    getOpenGames,
    getPlayerGames,
    deleteGame,
  };
}

// Hook to subscribe to a single game
export function useFirebaseGame(gameId: string | null) {
  const [game, setGame] = useState<ShadowDuelGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Mark as mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    if (!gameId || !database) {
      setGame(null);
      setLoading(false);
      return;
    }

    try {
      const gameRef = ref(database, `games/${gameId}`);
      const unsubscribe = onValue(gameRef, (snapshot) => {
        const data = snapshot.val();
        setGame(data);
        setLoading(false);
      }, (err) => {
        console.error('Game subscription error:', err);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Game init error:', err);
      setLoading(false);
    }
  }, [gameId, mounted]);

  return { game, loading };
}
