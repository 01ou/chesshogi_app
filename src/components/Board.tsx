import React from "react";
import styled from "styled-components";
import { BoardCell } from "../types/GameTypes";
import { Piece } from "../types/Pieces";
import { pieceImages, piecePromoteImages } from "../constants/pieceImages";

interface BoardProps {
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
  $mark: null | "move" | "place";
  $reverse: boolean;
}>`
  width: 50px; /* 固定サイズ */
  height: 50px; /* 固定サイズ */
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $mark, $isOccupied }) =>
    $mark ? ($mark === "move" ? "#ffeb3b" : "#eb3bff") : $isOccupied ? "#fff" : "#fff"};
  cursor: pointer;
  transform: ${({ $reverse }) => ($reverse ? "rotate(180deg)" : "none")};
  transition: background 0.3s;
`;

const PieceImage = styled.img`
  max-width: 90%;
  max-height: 90%;
`;
const Board: React.FC<BoardProps> = ({ board, moveMarks, placeMarks, onCellClick }) => {
  const mark = (x: number, y: number) => {
    if (moveMarks.some(([mx, my]) => mx === x && my === y)) {
      return "move";
    } else if (placeMarks.some(([mx, my]) => mx === x && my === y)) {
      return "place";
    }
    return null;
  };

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
              $mark={mark(x, y)}
              $reverse={cell?.team === "black"}
            >
              {cell?.name ? (
                <PieceImage
                  src={cell.promoted ? piecePromoteImages[cell.name as Piece] : pieceImages[cell.name as Piece]}
                  alt={cell.name}
                />
              ) : (
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
