import React, { useState } from 'react';
import styled from 'styled-components';
import { Piece } from '../types/Pieces';
import useMovePreview from '../hooks/useMovePreview';
import { pieceImages, piecePromoteImages } from '../constants/pieceImages';

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
  border: 2px solid #333;
  width: fit-content;
  margin: 0 auto;
`;

const CellBase = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #888;
`;

const Cell = styled(CellBase)<{ isMarked: boolean; isEdge: boolean }>`
  background-color: ${({ isMarked, isEdge }) =>
    isEdge ? '#ff7373' : isMarked ? '#82caff' : '#f0d9b5'};
`;

const PieceCell = styled(CellBase).attrs(() => ({
  as: 'img',
}))`
  width: 100%; /* セル全体に合わせる */
  height: 100%; /* セル全体に合わせる */
  object-fit: contain; /* 画像をセル内に収める */
  background-color: #f5f542;
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

const MovePreview: React.FC<MovePreviewProps> = ({ piece }) => {
  const { getMovements } = useMovePreview();
  const [isPromoted, setIsPromoted] = useState(false);

  const boardSize = 5;
  const center = Math.floor(boardSize / 2);
  const longMovePieces = [
    Piece.ShogiRook, Piece.ShogiBishop, Piece.ShogiPhoenix, Piece.ShogiLance,
    Piece.ChessRook, Piece.ChessBishop, Piece.ChessQueen, Piece.ChessLance
  ]

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
                <Cell key={`${x}-${y}`} isMarked={isMarked} isEdge={isEdge} />
              )
            )
          ) : (
            Array.from({ length: 5 }, (_, y) =>
              Array.from({ length: 5 }, (_, x) => (
                <Cell key={`${x}-${y}`} isMarked={false} isEdge={false} />
              ))
            )  
          )
        }
      </BoardContainer>
    )
  }
  
  return (
    <div>
      <Board />
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
    </div>
  );
};

export default MovePreview;
