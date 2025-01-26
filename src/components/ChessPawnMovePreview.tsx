import React from 'react';
import styled from 'styled-components';
import { CellBase } from '../styles/SharedStyles'; // Assuming CellBase is a generic cell component
import { DEFAULT_CHESS_WHITE_CELL_COLOR, MOVEABLE_CELL_COLOR, SELECTED_PIECE_CELL_COLOR } from '../constants/color';
import { pieceImages } from '../constants/pieceImages';
import { Piece } from '../types/Pieces';

const BoardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 50px);
  grid-template-rows: repeat(5, 50px);
  gap: 2px;
`;

const Cell = styled(CellBase)<{ isMarked: boolean; }>`
  background-color: ${({ isMarked }) =>
    isMarked ? MOVEABLE_CELL_COLOR : DEFAULT_CHESS_WHITE_CELL_COLOR};
  width: 50px;
  height: 50px;
`;

const PieceCell = styled(CellBase).attrs(() => ({
  as: 'img',
}))<{ isRotated?: boolean; cellType: "default" | "selectable" | "movable" }>`
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: ${({ cellType }) => cellType === "default" ? DEFAULT_CHESS_WHITE_CELL_COLOR : cellType === "selectable" ? SELECTED_PIECE_CELL_COLOR : MOVEABLE_CELL_COLOR};
  transform: ${({ isRotated }) => (isRotated ? 'rotate(180deg)' : 'none')};
  transition: transform 0.3s ease; /* Optional: Smooth rotation animation */
`;

interface ChessPawnMovePreviewProps {}

const ChessPawnMovePreview: React.FC<ChessPawnMovePreviewProps> = () => {
  const board = Array(5).fill(null).map(() => Array(5).fill(null)); // Create a 5x5 grid

  // Mark the positions of the chess pawn and enemy pawns
  const pawnPosition = [2, 2];
  const enemyPawnPositions = [
    [1, 1], // Top row, same column
    [1, 2], // Top-left
    [1, 3], // Bottom-left
  ];

  return (
    <BoardContainer>
      {board.map((row, rowIndex) =>
        row.map((_, colIndex) => {
          const cellKey = `${rowIndex}-${colIndex}`;
          const isPawn = rowIndex === pawnPosition[0] && colIndex === pawnPosition[1];
          const isEnemyPawn = enemyPawnPositions.some(
            (position) => position[0] === rowIndex && position[1] === colIndex
          );
  
          if (isPawn) {
            return (
              <PieceCell
                key={cellKey}
                src={pieceImages[Piece.ChessPawn]}
                cellType="selectable"
                alt="Pawn"
              />
            );
          }
  
          if (isEnemyPawn) {
            return (
              <PieceCell
                key={cellKey}
                src={pieceImages[Piece.ChessPawn]}
                cellType={colIndex !== 2 ? "movable" : "default"}
                alt="Enemy Pawn"
                isRotated
              />
            );
          }
  
          return (
            <Cell
              key={cellKey}
              isMarked={false} // Default behavior for unmarked cells
            />
          );
        })
      )}
    </BoardContainer>
  );  
}

export default ChessPawnMovePreview;
