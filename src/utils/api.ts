import axios, { AxiosResponse } from "axios";
import { GameState } from "../types/GameTypes";
import { InitializeSetting, SendAction } from "../types/apiTypes";

const API_BASE_URL = "https://chesshogi-api.onrender.com";

// ゲームの初期化
export const initializeGame = async (
  args: InitializeSetting
): Promise<AxiosResponse<any, any> | null> => {
  try {
    const payload: InitializeSetting = {
      boardType: args.boardType,
      black: {
        name: args.black.name,
        boardType: args.black.boardType,
        piecePlaceable: args.black.piecePlaceable
      },
      white: {
        name: args.white.name,
        boardType: args.white.boardType,
        piecePlaceable: args.white.piecePlaceable
      }
    };

    const response = await axios.post(`${API_BASE_URL}/initialize`, payload);
    return response;
  } catch (error) {
    console.error("Error initializing game:", error);
    return null;
  }
};

export const fetchGameState = async (): Promise<GameState> => {
  const response = await axios.get(`${API_BASE_URL}/state`);
  return response.data;
};

export const sendAction = async (
  action: SendAction
): Promise<GameState> => {
  const response = await axios.post(`${API_BASE_URL}/action`, action);
  return response.data;
};
