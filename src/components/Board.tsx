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
  enemyMovableCountMap: Record<string, number>
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
  $isEnemyMoveableCount: number;
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
  border: ${({ $isEnemyMoveableCount }) => {
    if ($isEnemyMoveableCount === 1) {
      return "3px solid #a7db72"; // 初期色
    }
    if ($isEnemyMoveableCount === 2) {
      return "3px solid #bf72db"; // 色を変更
    }
    if ($isEnemyMoveableCount >= 3) {
      return "3px solid #db7295"; // 色をさらに変更
    }
    return "none"; // カウントが0の場合はボーダーなし
  }};
  box-sizing: border-box;
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
  enemyMovableCountMap,
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

  const getPieceImage = (piece: Piece, promoted: boolean, rearranged: boolean) => {
    if (piece === Piece.ChessPawn && rearranged) {
      return promoted ? piecePromoteImages[Piece.ChessCrackedPawn] : pieceImages[Piece.ChessCrackedPawn];
    }
    return promoted ? piecePromoteImages[piece] : pieceImages[piece];
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
              $reverse={isPlannedMoveCell(x, y) ? plannedMove?.team === "black" : cell?.team === "black"}
              $cellColors={getCellColors(x, y)}
              $isEnemyMoveableCount={enemyMovableCountMap[`${x},${y}`]}
            >
              {plannedMove && isPlannedMoveCell(x, y) ? (
                <PieceImage
                  src={getPieceImage(plannedMove.name as Piece, plannedMove.promote, plannedMove.rearranged)}
                  opacity={0.3}
                  alt={plannedMove.name}
                />
              ) : cell?.name ? (
                <PieceImage
                  src={getPieceImage(cell.name as Piece, cell.promoted, cell.rearranged)}
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
