import React from "react";
import styled from "styled-components";
import { BoardCell, BoardSettings, PlannedMove } from "../types/GameTypes";
import { Piece } from "../types/Pieces";
import { pieceImages, piecePromoteImages } from "../constants/pieceImages";
import { BoardContainer, CellBase } from "../styles/SharedStyles";
import useCellColor from "../hooks/useCellColor";

interface CellColors {
  selected: string;
  move: string;
  place: string;
  default: string;
}

interface BoardProps {
  selectedPieceId: string | null;
  plannedMove: PlannedMove | null;
  board: BoardCell[][];
  moveMarks: [number, number][];
  placeMarks: [number, number][];
  boardSettings: BoardSettings;
  onCellClick: (x: number, y: number, cell: BoardCell) => void;
}

export const StyledBoard = styled(BoardContainer)<{ size: number }>`
  grid-template-columns: repeat(${({ size }) => size}, 50px);
  grid-template-rows: repeat(${({ size }) => size}, 50px);
`;

export const Cell = styled(CellBase)<{
  $isOccupied: boolean;
  $mark: null | "move" | "place" | "selected";
  $reverse: boolean;
  $cellColors: CellColors; // 外部から渡される色
}>`
  background: ${({ $mark, $isOccupied, $cellColors }) =>
    $mark
      ? $mark === "selected"
        ? $cellColors.selected
        : $mark === "move"
        ? $cellColors.move
        : $cellColors.place
      : $isOccupied
      ? $cellColors.default
      : $cellColors.default};
  cursor: pointer;
  transform: ${({ $reverse }) => ($reverse ? "rotate(180deg)" : "none")};
  transition: background 0.3s;
`;

const PieceImage = styled.img<{ opacity?: number }>`
  max-width: 90%;
  max-height: 90%;
  opacity: ${({ opacity }) => opacity || 1};
  transition: opacity 0.3s ease;
`;

const Board: React.FC<BoardProps> = ({
  selectedPieceId,
  plannedMove,
  board,
  moveMarks,
  placeMarks,
  boardSettings,
  onCellClick,
}) => {
  const { getCellColors } = useCellColor(boardSettings);

  const mark = (x: number, y: number) => {
    if (moveMarks.some(([mx, my]) => mx === x && my === y)) {
      return "move";
    } else if (placeMarks.some(([mx, my]) => mx === x && my === y)) {
      return "place";
    }
    return null;
  };

  const isPlannedMoveCell = (x: number, y: number) => {
    return plannedMove && plannedMove.x === x && plannedMove.y === y;
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
              $mark={cell?.id === selectedPieceId ? "selected" : mark(x, y)}
              $reverse={isPlannedMoveCell(x, y) ? plannedMove?.team === "black" : cell?.team === "black"}
              $cellColors={getCellColors(x, y)}
            >
              {plannedMove && isPlannedMoveCell(x, y) ? (
                <PieceImage
                  src={plannedMove.promote ? piecePromoteImages[plannedMove.name as Piece] : pieceImages[plannedMove.name as Piece]}
                  opacity={0.3}
                  alt={plannedMove.name}
                />
              ) : cell?.name ? (
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
