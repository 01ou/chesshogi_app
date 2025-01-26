import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Piece } from '../types/Pieces';
import useMovePreview from '../hooks/useMovePreview';
import { pieceImages, piecePromoteImages } from '../constants/pieceImages';
import { CellBase } from '../styles/SharedStyles';
import { DEFAULT_CHESS_WHITE_CELL_COLOR, DEFAULT_SHOGI_CELL_COLOR, MOVEABLE_CELL_COLOR, SELECTED_PIECE_CELL_COLOR } from '../constants/color';
import ChessPawnMovePreview from './ChessPawnMovePreview';

interface MovePreviewProps {
  piece: Piece | null;
}

const BoardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 50px);
  grid-template-rows: repeat(5, 50px);
  gap: 2px;
  background-color: #f0d9b5;
  width: fit-content;
  margin: 0 auto;
`;

const Cell = styled(CellBase)<{ isMarked: boolean; isEdge: boolean; defaultColor: string }>`
  background-color: ${({ isMarked, isEdge, defaultColor }) =>
    isEdge ? '#ff7373' : isMarked ? MOVEABLE_CELL_COLOR : defaultColor};
`;

const ControlPanel = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const CheckboxLabel = styled.label`
  font-size: 16px;
`;

const PieceCell = styled(CellBase).attrs(() => ({
  as: 'img',
}))`
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: ${SELECTED_PIECE_CELL_COLOR};
`;

// Helper function for default cell color
const getDefaultColor = (piece: Piece | null): string => {
  const isShogi = piece?.startsWith('Shogi') ?? false;
  return isShogi ? DEFAULT_SHOGI_CELL_COLOR : DEFAULT_CHESS_WHITE_CELL_COLOR;
};

const MovePreview: React.FC<MovePreviewProps> = ({ piece }) => {
  const { getMovements } = useMovePreview();
  const [isPromoted, setIsPromoted] = useState(false);
  const [isCheckedWithEnemy, setIsCheckedWithEnemy] = useState(false);
  const [lastPiece, setLastPiece] = useState<Piece | null>(null);

  useEffect(() => {
    if (piece) {
      setLastPiece(piece);
    }
  }, [piece]);

  const boardSize = 5;
  const center = Math.floor(boardSize / 2);

  const movements = piece ? getMovements(piece, isPromoted) : [];
  const flippedMovements = movements.map(([dy, dx]) => [-dy, dx]);

  const isChessPawn = piece === Piece.ChessPawn || piece === Piece.ChessCrackedPawn;

  const longMovePieces = [
    Piece.ShogiRook, Piece.ShogiBishop, Piece.ShogiPhoenix, Piece.ShogiLance,
    Piece.ChessRook, Piece.ChessBishop, Piece.ChessQueen, Piece.ChessLance, Piece.ChessPawn,
  ];

  const isEdgeCell = (piece: Piece, relativeX: number, relativeY: number): boolean => {
    return (
      longMovePieces.includes(piece) &&
      (relativeX === -center || relativeX === center || 
      relativeY === -center || relativeY === center)
    );
  };

  const generateBoard = () => {
    return Array.from({ length: boardSize }, (_, y) =>
      Array.from({ length: boardSize }, (_, x) => {
        const relativeX = x - center;
        const relativeY = y - center;

        const isMarked = flippedMovements.some(([dy, dx]) => dy === relativeY && dx === relativeX);
        const isEdge = piece && isMarked ? isEdgeCell(piece, relativeX, relativeY) : false;
        const isCenter = x === center && y === center;

        return { isMarked, isEdge, isCenter, x, y };
      })
    ).flat();
  };

  const board = generateBoard();

  return (
    <div>
      <ControlPanel>
        <CheckboxLabel>
          <input
            type="checkbox"
            checked={!isCheckedWithEnemy && isPromoted}
            onChange={(e) => {
              const state = e.target.checked
              setIsPromoted(state);
              if (state) {
                setIsCheckedWithEnemy(false);
              }
            }}
          />
          成り
        </CheckboxLabel>
        {isChessPawn &&
          <CheckboxLabel>
            <input
              type="checkbox"
              checked={isCheckedWithEnemy}
              onChange={(e) => {
                const state = e.target.checked
                setIsCheckedWithEnemy(state);
                if (state) {
                  setIsPromoted(false);
                }
              }}
            />
            駒があるとき
          </CheckboxLabel>
        }
      </ControlPanel>

      <BoardContainer>
        {piece ? (
          isChessPawn && isCheckedWithEnemy ? (
            <ChessPawnMovePreview />
          ) : (
            board.map(({ isMarked, isEdge, isCenter, x, y }) => (
              isCenter ? (
                <PieceCell
                  key={`${x}-${y}`}
                  src={(isPromoted && piecePromoteImages[piece]) ? piecePromoteImages[piece] : pieceImages[piece]}
                />
              ) : (
                <Cell
                  key={`${x}-${y}`}
                  isMarked={isMarked}
                  isEdge={isEdge}
                  defaultColor={getDefaultColor(piece)}
                />
              )
            ))
          )
        ) : (
          board.map(({ x, y }) => (
            <Cell
              key={`${x}-${y}`}
              isMarked={false}
              isEdge={false}
              defaultColor={getDefaultColor(lastPiece ?? Piece.ShogiPawn)}
            />
          ))
        )}
      </BoardContainer>
    </div>
  );
};

export default MovePreview;
