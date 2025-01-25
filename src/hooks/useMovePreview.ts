import { Piece } from "../types/Pieces";

const useMovePreview = () => {
  type Position = [number, number]; // [縦方向, 横方向]

  interface PieceMovements {
    normal: Position[];
    promoted?: Position[];
  }

  // 共通の動き生成関数
  const generateLineMoves = (x: number, y: number, maxSteps: number = 8): Position[] =>
    Array.from({ length: maxSteps }, (_, i) => [(i + 1) * x, (i + 1) * y]);

  const combineMoves = (...moves: Position[][]): Position[] =>
    moves.flat();

  // 駒ごとの動きを定義
  const movements: { [piece: string]: PieceMovements } = {
    [Piece.ShogiKing]: {
      normal: [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]],
    },
    [Piece.ShogiPawn]: {
      normal: [[1, 0]],
      promoted: [[1, 0], [1, 1], [0, 1], [-1, 0], [0, -1], [1, -1]]
    },
    [Piece.ShogiGold]: {
      normal: [[1, 0], [1, 1], [0, 1], [-1, 0], [0, -1], [1, -1]]
    },
    [Piece.ShogiSilver]: {
      normal: [[1, 0], [1, 1], [-1, 1], [-1, -1], [1, -1]],
      promoted: [[1, 0], [1, 1], [0, 1], [-1, 0], [0, -1], [1, -1]],
    },
    [Piece.ShogiKnight]: {
      normal: [[2, 1], [2, -1]],
      promoted: [[1, 0], [1, 1], [0, 1], [-1, 0], [0, -1], [1, -1]],
    },
    [Piece.ShogiLance]: {
      normal: generateLineMoves(1, 0),
      promoted: [[1, 0], [1, 1], [0, 1], [-1, 0], [0, -1], [1, -1]],
    },
    [Piece.ShogiRook]: {
      normal: combineMoves(
        generateLineMoves(1, 0),
        generateLineMoves(-1, 0),
        generateLineMoves(0, 1),
        generateLineMoves(0, -1)
      ),
      promoted: combineMoves(
        generateLineMoves(1, 0),
        generateLineMoves(-1, 0),
        generateLineMoves(0, 1),
        generateLineMoves(0, -1),
        [[1, 1], [1, -1], [-1, 1], [-1, -1]]
      ),
    },
    [Piece.ShogiBishop]: {
      normal: combineMoves(
        generateLineMoves(1, 1),
        generateLineMoves(-1, -1),
        generateLineMoves(1, -1),
        generateLineMoves(-1, 1)
      ),
      promoted: combineMoves(
        generateLineMoves(1, 1),
        generateLineMoves(-1, -1),
        generateLineMoves(1, -1),
        generateLineMoves(-1, 1),
        [[1, 0], [0, 1], [-1, 0], [0, -1]]
      ),
    },
    [Piece.ShogiJumper]: {
      normal: [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]],
      promoted: combineMoves(
        [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]],
        [[1, 0], [0, 1], [-1, 0], [0, -1]]
      ),
    },
    [Piece.ShogiPhoenix]: {
      normal: combineMoves(
        generateLineMoves(1, 0),
        generateLineMoves(-1, 0),
        generateLineMoves(0, 1),
        generateLineMoves(0, -1),
        generateLineMoves(1, 1),
        generateLineMoves(-1, -1),
        generateLineMoves(1, -1),
        generateLineMoves(-1, 1)
      ),
    },
    [Piece.ChessPawn]: { normal: [[1, 0]] },
    [Piece.ChessKing]: {
      normal: [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]],
    },
    [Piece.ChessQueen]: {
      normal: combineMoves(
        generateLineMoves(1, 0),
        generateLineMoves(-1, 0),
        generateLineMoves(0, 1),
        generateLineMoves(0, -1),
        generateLineMoves(1, 1),
        generateLineMoves(-1, -1),
        generateLineMoves(1, -1),
        generateLineMoves(-1, 1)
      ),
    },
    [Piece.ChessRook]: {
      normal: combineMoves(
        generateLineMoves(1, 0),
        generateLineMoves(-1, 0),
        generateLineMoves(0, 1),
        generateLineMoves(0, -1)
      ),
    },
    [Piece.ChessBishop]: {
      normal: combineMoves(
        generateLineMoves(1, 1),
        generateLineMoves(-1, -1),
        generateLineMoves(1, -1),
        generateLineMoves(-1, 1)
      ),
    },
    [Piece.ChessKnight]: {
      normal: [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]],
    },
    [Piece.ChessPillar]: {
      normal: [[1, 0], [2, 0], [0, 1], [0, 2], [-1, 0], [-2, 0], [0, -1], [0, -2]],
    },
    [Piece.ChessWisp]: {
      normal: [[1, 1], [2, 2], [-1, 1], [-2, 2], [-1, -1], [-2, -2], [1, -1], [2, -2]],
    },
    [Piece.ChessLance]: {
      normal: generateLineMoves(1, 0),
    },
  };

  // 動きを取得する関数
  const getMovements = (piece: Piece, isPromoted?: boolean): Position[] => {
    const movement = movements[piece];
    if (!movement) {
      console.error("存在しない駒が選択されました");
      return [];
    }
    return isPromoted && movement.promoted ? movement.promoted : movement.normal;
  };

  return { getMovements };
};

export default useMovePreview;
