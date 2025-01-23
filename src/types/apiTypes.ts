export type BoardType = "shogi" | "chess";

export type PlayerShogiBoardType = "shogi" | "wideChess" | "replaceShogi";
export type PlayerChessBoardType = "chess" | "narrowShogi" | "replaceChess";

export type PlayerBoardType<T extends BoardType> =
  T extends "shogi" ? PlayerShogiBoardType : PlayerChessBoardType;

export interface SendAction {
  targetPieceId: string;
  actionType: "move" | "place";
  promote: boolean;
  x: number;
  y: number;
}

export interface PlayerSetting {
  name: string;
  boardType: PlayerBoardType<BoardType>;
  piecePlaceable: boolean;
  promotable?: boolean;
}

export interface InitializeSetting {
  boardType: BoardType;
  black: PlayerSetting;
  white: PlayerSetting;
}