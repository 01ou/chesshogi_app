// Game.tsx
import React, { useEffect, useState } from "react";
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

const Select = styled.select`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
`;

const Game: React.FC = () => {
  const {
    isAIResponds,
    depth,
    gameState,
    touchedPiece,
    selectedPiece,
    selectedCapturedPiece,
    promotionDialog,
    plannedMove,
    setIsAIResponds,
    setDepth,
    handleSelectAndMove,
    handlePromoteDecision,
    handleCapturedPieceClick
  } = useGameLogic();

  const [enemyMovableCountMap, setEnemyMovablesCount] = useState<Record<string, number>>({});
  const [guide, setGuide] = useState(false);

  if (!gameState) {
    return "初期化を行ってください";
  }


  useEffect(() => {
    const enemyMovablesArray = Object.values(gameState.legalActions)
      .filter(value => value.team !== gameState.turn.player)
      .map(value => [...value.moves, ...value.allyBlocks])
      .flat();

    // 座標ごとの数をカウントする辞書を作成
    const enemyMovableCountMap = enemyMovablesArray.reduce((acc, [x, y]) => {
      const key = `${x},${y}`; // 座標をキーとして使用
      acc[key] = acc[key] ? acc[key] + 1 : 1; // 既に存在する場合はカウントを増やし、なければ1に設定
      return acc;
    }, {} as Record<string, number>);

    setEnemyMovablesCount(enemyMovableCountMap);
  }, [gameState]);
  
  return (
    <Container>
      <HeadingContainer>
        <Heading>Chesshogi</Heading>
        <label>
          <input
            type="checkbox"
            checked={guide}
            onChange={(e) => setGuide(e.target.checked)}
          />
          移動範囲のガイド
        </label>
        <label>
          <input
            type="checkbox"
            checked={isAIResponds}
            onChange={(e) => setIsAIResponds(e.target.checked)}
          />
          AIを使用する
        </label>
        <Select value={depth} onChange={(e) => setDepth(Number(e.target.value))}>
          {[0, 1, 2, 3].map((depth) => (
            <option key={depth} value={depth}>
              AI Level: {depth}
            </option>
          ))}
        </Select>
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
          enemyMovableCountMap={guide ? enemyMovableCountMap : {}}
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