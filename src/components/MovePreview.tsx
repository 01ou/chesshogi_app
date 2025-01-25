import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Piece } from '../types/Pieces';
import useMovePreview from '../hooks/useMovePreview';
import { pieceImages, piecePromoteImages } from '../constants/pieceImages';
import { CellBase } from '../styles/SharedStyles';
import { DEFAULT_CHESS_BLACK_CELL_COLOR, DEFAULT_CHESS_WHITE_CELL_COLOR, DEFAULT_SHOGI_CELL_COLOR, MOVEABLE_CELL_COLOR, SELECTED_PIECE_CELL_COLOR } from '../constants/color';

interface MovePreviewProps {
  piece: Piece | null;
}

// コンテナのスタイリング
const BoardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 50px);
  grid-template-rows: repeat(5, 50px);
  gap: 2px;
  background-color: #f0d9b5;
  width: fit-content;
  margin: 0 auto;
`;

const Cell = styled(CellBase)<{ 
  isMarked: boolean; 
  isEdge: boolean; 
  defaultColor: string; // Optional prop for default color
}>`
  background-color: ${({ isMarked, isEdge, defaultColor }) =>
    isEdge ? "#ff7373" : isMarked ? MOVEABLE_CELL_COLOR : defaultColor};
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
  as: "img",
}))`
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: ${SELECTED_PIECE_CELL_COLOR}
`;

const MovePreview: React.FC<MovePreviewProps> = ({ piece }) => {
  const { getMovements } = useMovePreview();
  const [isPromoted, setIsPromoted] = useState(false);
  const [lastPiece, setLastPiece] = useState<Piece | null>(null);

  useEffect(() => {
    if (piece) {
      setLastPiece(piece);
    }
  }, [piece])

  const boardSize = 5;
  const center = Math.floor(boardSize / 2);
  const longMovePieces = [
    Piece.ShogiRook, Piece.ShogiBishop, Piece.ShogiPhoenix, Piece.ShogiLance,
    Piece.ChessRook, Piece.ChessBishop, Piece.ChessQueen, Piece.ChessLance
  ]

  const getDefaultColor = (x: number, y: number, piece: Piece) => {
    const isShogi = piece.startsWith("Shogi");
    return isShogi ? DEFAULT_SHOGI_CELL_COLOR : DEFAULT_CHESS_WHITE_CELL_COLOR
  }

  // 動ける範囲を取得
  const movements = piece ? getMovements(piece, isPromoted) : [];

  // ボード端を特定する関数
  const isEdgeCell = (piece: Piece, relativeX: number, relativeY: number): boolean => {
    return (
      longMovePieces.includes(piece) &&
      (relativeX === -center || relativeX === center || 
      relativeY === -center || relativeY === center)
    );
  };

  const flippedMovements = movements.map(([dy, dx]) => [-dy, dx]);

  // ボードデータを生成
  const board = Array.from({ length: boardSize }, (_, y) =>
    Array.from({ length: boardSize }, (_, x) => {
      const relativeX = x - center;
      const relativeY = y - center;

      const isMarked = flippedMovements.some(([dy, dx]) => dy === relativeY && dx === relativeX);
      const isEdge = (isMarked && piece) ? isEdgeCell(piece, relativeX, relativeY) : false;
      const isCenter = x === center && y === center;

      return { isMarked, isEdge, isCenter, x, y };
    })
  );

  const Board = () => {
    return (
      <BoardContainer>
        {
          piece ? (
            board.flat().map(({ isMarked, isEdge, isCenter, x, y }) =>
              isCenter ? (
                <PieceCell
                  key={`${x}-${y}`}
                  src={(isPromoted && piecePromoteImages[piece]) ? piecePromoteImages[piece] : pieceImages[piece]}
                />
              ) : (
                <Cell key={`${x}-${y}`} isMarked={isMarked} isEdge={isEdge} defaultColor={getDefaultColor(x, y, piece)} />
              )
            )
          ) : (
            Array.from({ length: 5 }, (_, y) =>
              Array.from({ length: 5 }, (_, x) => (
                <Cell key={`${x}-${y}`} isMarked={false} isEdge={false} defaultColor={getDefaultColor(x, y, lastPiece ?? Piece.ShogiPawn)} />
              ))
            )  
          )
        }
      </BoardContainer>
    )
  }
  
  return (
    <div>
      <ControlPanel>
        <CheckboxLabel>
          <input
            type="checkbox"
            checked={isPromoted}
            onChange={(e) => setIsPromoted(e.target.checked)}
          />
          成り
        </CheckboxLabel>
      </ControlPanel>
      <Board />
    </div>
  );
};

export default MovePreview;
