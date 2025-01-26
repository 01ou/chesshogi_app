import { GameState } from "./GameTypes";

export type BoardType = "shogi" | "chess";

export type PlayerShogiBoardType = "shogi" | "wideChess" | "replaceShogi";
export type PlayerChessBoardType = "chess" | "narrowShogi" | "replaceChess";

export type PlayerBoardType= PlayerShogiBoardType | PlayerChessBoardType;

export interface SendAction {
  isAIResponds: boolean;
  targetPieceId: string;
  actionType: "move" | "place";
  promote: boolean;
  x: number;
  y: number;
}

export interface PlayerSetting {
  name: string;
  boardType: PlayerBoardType;
  piecePlaceable: boolean;
  promotable?: boolean;
}

export interface InitializeSetting {
  boardType: BoardType;
  black: PlayerSetting;
  white: PlayerSetting;
}

export interface AIAction {
  pieceId: string;
  from: [number, number],
  to: [number, number],
  promote: boolean,
}

export interface ResponseData {
  aiAction: AIAction;
  gameState: GameState;
}