// Game.tsx
import React from "react";
import { useGameLogic } from "../hooks/useGameLogic";
import styled from "styled-components";
import Board from "./Board";
import CapturedPieces from "./CapturedPieces";
import MovePreview from "./MovePreview";
import PromoteDialog from "./PromoteDialog";

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: center;
  }
`;

export const HeadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

export const Heading = styled.h3`
  margin-right: 20px;

  @media (max-width: 768px) {
    margin-right: 0;
  }
`;

export const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 300px;
  margin-right: 20px;

  @media (max-width: 768px) {
    flex-direction: row;
    width: 100%;
    margin-right: 0;
    margin-top: 20px;
  }
`;

export const BoardWrapper = styled.div`
  background: #f0f0f0;
  padding: 16px;
  flex: 1;

  @media (max-width: 768px) {
    padding: 8px;
  }
`;

const Game: React.FC = () => {
  const {
    isAIResponds,
    gameState,
    touchedPiece,
    selectedPiece,
    selectedCapturedPiece,
    promotionDialog,
    plannedMove,
    setIsAIResponds,
    handleSelectAndMove,
    handlePromoteDecision,
    handleCapturedPieceClick
  } = useGameLogic();

  if (!gameState) {
    return "初期化を行ってください";
  }

  return (
    <Container>
      <HeadingContainer>
        <Heading>Chesshogi</Heading>
        <label>
          <input
            type="checkbox"
            checked={isAIResponds}
            onChange={(e) => setIsAIResponds(e.target.checked)}
          />
          AIを使用する
        </label>
      </HeadingContainer>
      <SidePanel>
        <CapturedPieces
          capturedPieces={gameState.capturedPieces}
          onPieceClick={handleCapturedPieceClick}
        />
        <MovePreview piece={touchedPiece} />
      </SidePanel>
      <BoardWrapper>
        <Board
          selectedPieceId={selectedPiece?.piece.id ?? null}
          plannedMove={plannedMove}
          board={gameState.board}
          moveMarks={selectedPiece?.legalMoves ?? []}
          placeMarks={selectedCapturedPiece?.legalPlaces ?? []}
          boardSettings={gameState.boardSettings}
          onCellClick={(x, y, cell) => handleSelectAndMove(x, y, cell)}
        />
      </BoardWrapper>
      {promotionDialog && (
        <PromoteDialog onConfirm={handlePromoteDecision} />
      )}
    </Container>
  );
};

export default Game;