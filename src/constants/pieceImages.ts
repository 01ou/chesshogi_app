import { Piece } from "../types/Pieces";

// 将棋の通常駒の画像をインポート
import shogiKing from "../assets/images/pieces/shogi_king.png";
import shogiRook from "../assets/images/pieces/shogi_rook.png";
import shogiBishop from "../assets/images/pieces/shogi_bishop.png";
import shogiPawn from "../assets/images/pieces/shogi_pawn.png";
import shogiLance from "../assets/images/pieces/shogi_lance.png";
import shogiKnight from "../assets/images/pieces/shogi_knight.png";
import shogiGold from "../assets/images/pieces/shogi_gold.png";
import shogiSilver from "../assets/images/pieces/shogi_silver.png";
import shogiJumper from "../assets/images/pieces/shogi_jumper.png";

// 将棋の成り駒の画像をインポート
import shogiPromRook from "../assets/images/pieces/shogi_prom_rook.png";
import shogiPromBishop from "../assets/images/pieces/shogi_prom_bishop.png";
import shogiPromPawn from "../assets/images/pieces/shogi_prom_pawn.png";
import shogiPromLance from "../assets/images/pieces/shogi_prom_lance.png";
import shogiPromKnight from "../assets/images/pieces/shogi_prom_knight.png";
import shogiPromSilver from "../assets/images/pieces/shogi_prom_silver.png";
import shogiPromJumper from "../assets/images/pieces/shogi_prom_jumper.png";
import shogiPromPhoenix from "../assets/images/pieces/shogi_prom_phoenix.png";

// チェスの駒の画像をインポート
import chessKing from "../assets/images/pieces/chess_king.png";
import chessQueen from "../assets/images/pieces/chess_queen.png";
import chessRook from "../assets/images/pieces/chess_rook.png";
import chessBishop from "../assets/images/pieces/chess_bishop.png";
import chessKnight from "../assets/images/pieces/chess_knight.png";
import chessPawn from "../assets/images/pieces/chess_pawn.png";
import chessPillar from "../assets/images/pieces/chess_pillar.png";
import chessWish from "../assets/images/pieces/chess_wisp.png";
import chessLance from "../assets/images/pieces/chess_lance.png";
import chessSentinel from "../assets/images/pieces/chess_sentinel.png";
import chessCrackedPawn from "../assets/images/pieces/chess_cracked_pawn.png";
import chessPawnQueen from "../assets/images/pieces/chess_pawn_queen.png";

// 通常駒の画像マッピング
const pieceImages: { [key in Piece]: string } = {
  // 将棋の駒
  [Piece.ShogiKing]: shogiKing,
  [Piece.ShogiRook]: shogiRook,
  [Piece.ShogiBishop]: shogiBishop,
  [Piece.ShogiPawn]: shogiPawn,
  [Piece.ShogiLance]: shogiLance,
  [Piece.ShogiKnight]: shogiKnight,
  [Piece.ShogiGold]: shogiGold,
  [Piece.ShogiSilver]: shogiSilver,
  [Piece.ShogiJumper]: shogiJumper,
  [Piece.ShogiPhoenix]: shogiPromPhoenix,

  // チェスの駒
  [Piece.ChessKing]: chessKing,
  [Piece.ChessQueen]: chessQueen,
  [Piece.ChessRook]: chessRook,
  [Piece.ChessBishop]: chessBishop,
  [Piece.ChessKnight]: chessKnight,
  [Piece.ChessPawn]: chessPawn,
  [Piece.ChessPillar]: chessPillar,
  [Piece.ChessWisp]: chessWish,
  [Piece.ChessLance]: chessLance,
  [Piece.ChessSentinel]: chessSentinel,
  [Piece.ChessCrackedPawn]: chessCrackedPawn,
};

// 成り駒の画像マッピング (将棋のみ)
const piecePromoteImages: { [key in Piece]?: string } = {
  [Piece.ShogiRook]: shogiPromRook,
  [Piece.ShogiBishop]: shogiPromBishop,
  [Piece.ShogiPawn]: shogiPromPawn,
  [Piece.ShogiLance]: shogiPromLance,
  [Piece.ShogiKnight]: shogiPromKnight,
  [Piece.ShogiSilver]: shogiPromSilver,
  [Piece.ShogiJumper]: shogiPromJumper,
  [Piece.ShogiPhoenix]: shogiPromPhoenix,
  [Piece.ChessPawn]: chessPawnQueen,
  [Piece.ChessLance]: chessSentinel,
  [Piece.ChessCrackedPawn]: chessSentinel,
};

export { pieceImages, piecePromoteImages };
