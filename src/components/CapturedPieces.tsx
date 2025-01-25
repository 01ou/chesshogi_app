import React from "react";
import styled from "styled-components";
import { CapturedPiece } from "../types/GameTypes";
import { Piece } from "../types/Pieces";
import { pieceImages } from "../constants/pieceImages";

interface CapturedPiecesProps {
  capturedPieces: { [team: string]: CapturedPiece[] }; // チームごとに持ち駒を管理
  onPieceClick: (pieceId: string, name: string, team: string) => void; // 持ち駒クリック時のイベントハンドラ
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
`;

const TeamSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TeamTitle = styled.h3`
  margin: 0;
  color: #555;
`;

const PieceList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
`;

const PieceItem = styled.div<{ $team: string }>`
  width: 50px;
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ $team }) => ($team === "black" ? "#ddd" : "#eee")};
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const PieceImage = styled.img`
  max-width: 40px;
  max-height: 40px;
`;

const PieceCount = styled.div`
  font-size: 12px;
  color: #888;
`;

const CapturedPieces: React.FC<CapturedPiecesProps> = ({
  capturedPieces,
  onPieceClick,
}) => {
  return (
    <Container>
      {["black", "white"].map((team) => (
        <TeamSection key={team}>
          <TeamTitle>{team === "black" ? "Black" : "White"}</TeamTitle>
          <PieceList>
            {capturedPieces[team]?.map((piece) => (
              <PieceItem
                key={piece.name}
                onClick={() => {
                  if (piece.pieceIds.length > 0) {
                    onPieceClick(piece.pieceIds[0], piece.name, team); // 最初のIDを送信
                  }
                }}
                $team={team}
              >
                <PieceImage
                  src={pieceImages[piece.name as Piece]}
                  alt={piece.name}
                />
                <PieceCount>x{piece.pieceIds.length}</PieceCount>
              </PieceItem>
            ))}
          </PieceList>
        </TeamSection>
      ))}
    </Container>
  );
};

export default CapturedPieces;
