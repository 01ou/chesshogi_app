import React from "react";
import styled from "styled-components";
import { BoardCell, PlannedMove } from "../types/GameTypes";
import { Piece } from "../types/Pieces";
import { pieceImages, piecePromoteImages } from "../constants/pieceImages";

interface BoardProps {
  selectedPieceId: string | null;
  plannedMove: PlannedMove | null;
  board: BoardCell[][];
  moveMarks: [number, number][];
  placeMarks: [number, number][];
  onCellClick: (x: number, y: number, cell: BoardCell) => void;
}

const BoardContainer = styled.div`
  display: flex; /* フレックスボックスで配置 */
  justify-content: center; /* 横方向中央揃え */
  align-items: center; /* 縦方向中央揃え */
  height: 80vh; /* 画面全体の高さ */
  background-color: #f0f0f0; /* 背景色（任意） */
`;

const StyledBoard = styled.div<{ size: number }>`
  display: grid;
  grid-template-columns: repeat(${({ size }) => size}, 50px); /* セルの幅を固定 */
  grid-template-rows: repeat(${({ size }) => size}, 50px); /* セルの高さを固定 */
  gap: 2px; /* セル間隔を固定 */
  background: #333;
`;

const Cell = styled.div<{
  $isOccupied: boolean;
  $mark: null | "move" | "place" | "selected";
  $reverse: boolean;
}>`
  width: 50px; /* 固定サイズ */
  height: 50px; /* 固定サイズ */
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $mark, $isOccupied }) =>
    $mark ? ($mark === "selected" ? "#ebff3b" : "#ffeb3b") : $isOccupied ? "#fff" : "#fff"};
  cursor: pointer;
  transform: ${({ $reverse }) => ($reverse ? "rotate(180deg)" : "none")};
  transition: background 0.3s;
`;

const PieceImage = styled.img<{ opacity?: number }>`
  max-width: 90%;
  max-height: 90%;
  opacity: ${({ opacity }) => opacity || 1}; /* デフォルトは不透明 */
  transition: opacity 0.3s ease; /* 透明度の変更時にアニメーションを追加 */
`;

const Board: React.FC<BoardProps> = ({ selectedPieceId, plannedMove, board, moveMarks, placeMarks, onCellClick }) => {
  const mark = (x: number, y: number) => {
    if (moveMarks.some(([mx, my]) => mx === x && my === y)) {
      return "move";
    } else if (placeMarks.some(([mx, my]) => mx === x && my === y)) {
      return "place";
    }
    return null;
  };

  const isPlannedMoveCell = (x: number, y: number) => {
    return plannedMove && plannedMove.x == x && plannedMove.y == y
  }

  return (
    <BoardContainer>
      <StyledBoard size={board.length}>
        {board.map((row, y) =>
          row.map((cell, x) => (
            <Cell
              key={`${x}-${y}`}
              onClick={() => {
                onCellClick(x, y, cell);
              }}
              $isOccupied={!!cell?.name}
              $mark={cell?.id === selectedPieceId ? "selected" : mark(x, y)}
              $reverse={(isPlannedMoveCell(x, y) && plannedMove) ? plannedMove.team === "black" : cell?.team === "black"}
            >
              {(plannedMove && isPlannedMoveCell(x, y)) ? (
                <PieceImage
                  src={plannedMove.promote ? piecePromoteImages[plannedMove.name as Piece] : pieceImages[plannedMove.name as Piece]}
                  opacity={0.3}
                  alt={plannedMove.name}
                />
              ) : (cell?.name) ? (
                <PieceImage
                  src={cell.promoted ? piecePromoteImages[cell.name as Piece] : pieceImages[cell.name as Piece]}
                  alt={cell.name}
                />
              ) :  (
                ""
              )}
            </Cell>
          ))
        )}
      </StyledBoard>
    </BoardContainer>
  );
};

export default Board;
