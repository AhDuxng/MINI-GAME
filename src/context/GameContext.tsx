'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface Player {
  id: string
  name: string
}

interface GameContextType {
  players: Player[]
  setPlayers: (players: Player[]) => void
  addPlayer: (player: Player) => void
  removePlayer: (id: string) => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([])

  const addPlayer = (player: Player) => {
    setPlayers(prev => [...prev, player])
  }

  const removePlayer = (id: string) => {
    setPlayers(prev => prev.filter(p => p.id !== id))
  }

  return (
    <GameContext.Provider value={{ players, setPlayers, addPlayer, removePlayer }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within GameProvider')
  }
  return context
}
