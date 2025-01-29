import axios, { AxiosResponse } from "axios";
import { GameState } from "../types/GameTypes";
import { InitializeSetting, ResponseData, SendAction } from "../types/apiTypes";
import { getUserIdFromLocalStorage } from "./uid";

const API_URL: string = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ゲームの初期化
export const initializeGame = async (
  args: InitializeSetting
): Promise<AxiosResponse<any, any> | null> => {
  try {
    const payload: InitializeSetting & { userId: string } = {
      userId: getUserIdFromLocalStorage(),
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

    const response = await axios.post(`${API_URL}/initialize`, payload);
    return response;
  } catch (error) {
    console.error("Error initializing game:", error);
    return null;
  }
};

export const fetchGameState = async (): Promise<GameState> => {
  const response = await axios.get(`${API_URL}/state/${getUserIdFromLocalStorage()}`);
  return response.data;
};

export const sendAction = async (
  action: SendAction
): Promise<ResponseData> => {
  const payload: SendAction & { userId: string } = {
    isAIResponds: action.isAIResponds,
    depth: action.depth,
    userId: getUserIdFromLocalStorage(),
    targetPieceId: action.targetPieceId,
    actionType: action.actionType,
    promote: action.promote,
    x: action.x,
    y: action.y
  }
  const response = await axios.post(`${API_URL}/action`, payload);
  return response.data;
};
