// Danh sách người chơi dùng chung cho mọi game, nhập một lần và lưu bền trong localStorage
'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import useLocalStorage from '@/shared/hooks/useLocalStorage';

interface PlayersContextValue {
  players: string[];
  setPlayers: (players: string[]) => void;
  playersReady: boolean;
}

const PlayersContext = createContext<PlayersContextValue | null>(null);

export function PlayersProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers, playersReady] = useLocalStorage<string[]>('players', []);
  const value = useMemo(() => ({ players, setPlayers, playersReady }), [players, setPlayers, playersReady]);
  return <PlayersContext.Provider value={value}>{children}</PlayersContext.Provider>;
}

export function usePlayers() {
  const context = useContext(PlayersContext);
  if (!context) throw new Error('usePlayers phải được dùng bên trong PlayersProvider');
  return context;
}
