import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { GameState } from "../types/GameTypes";
import { fetchGameState, sendAction } from "../utils/api";
import { SendAction } from "../types/apiTypes";

interface GameContextProps {
  gameState: GameState | null;
  setGameState: (state: GameState) => void;
  updateGameState: () => Promise<void>;
  takeAction: (action: SendAction) => Promise<void>;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    updateGameState();
  }, [])

  const updateGameState = async () => {
    try {
      const state = await fetchGameState();
      setGameState(state);
    } catch (error) {
      console.error("Failed to fetch game state:", error);
    }
  };

  const takeAction = async (action: SendAction) => {
    try {
      const state = await sendAction(action);
      setGameState(state);
    } catch (error) {
      console.error("Failed to send action:", error);
    }
  }

  useEffect(() => {
    console.log(gameState);
  }, [gameState])

  return (
    <GameContext.Provider value={{ gameState, setGameState, updateGameState, takeAction }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = (): GameContextProps => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
