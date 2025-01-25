import { BoardType, PlayerBoardType, SendAction } from "./apiTypes";

export interface PieceState {
  id: string;
  name: string;
  promoted: boolean;
  promotable: boolean;
  promoteLine: number;
  immobileRow: number | null;
  team: "black" | "white";
}

export type BoardCell = PieceState | null;

export interface CapturedPiece {
  name: string;
  pieceIds: string[];
  placeable: boolean;
}

export interface BoardSettings {
  type: BoardType;
  size: number;
  blackBoard: PlayerBoardType;
  whiteBoard: PlayerBoardType;
}

export interface GameState {
  board: BoardCell[][];
  boardSettings: BoardSettings;
  capturedPieces: {
    black: CapturedPiece[];
    white: CapturedPiece[];
  };
  turn: {
    player: string;
    step: number;
  };
  lastMove: string | null;
  checkStatus: {
    white: boolean;
    black: boolean;
  };
  legalActions: Record<string, {
    moves: [number, number][];
    places: [number, number][];
  }>
  gameResult: string | null;
  error: string | null;
}

export interface LegalActions {
  moves: { [key: string]: [number, number][] };
  places: { [key: string]: [number, number][] };
}

export type PlannedMove = SendAction & {
  name: string;
  team: string;
}
