import React, { useEffect, useState } from "react";
import { BoardCell, PieceState, PlannedMove } from "../types/GameTypes";
import CapturedPieces from "./CapturedPieces";
import Board from "./Board";
import { useGameContext } from "../contexts/GameContext";
import PromoteDialog from "./PromoteDialog";
import MovePreview from "./MovePreview";
import { Piece } from "../types/Pieces";
import { SendAction } from "../types/apiTypes";
import styled from "styled-components";

interface GameProps {}


export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
`;

export const Heading = styled.h3`
  margin-right: 20px;
`;

export const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 300px;
  margin-right: 20px;
`;

export const BoardWrapper = styled.div`
  background: #f0f0f0;
  padding: 16px;
`;

const Game: React.FC<GameProps> = () => {
  const { gameState, takeAction } = useGameContext();
  const [touchedPiece, setTouchedPiece] = useState<Piece | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<{
    piece: PieceState;
    x: number;
    y: number;
    legalMoves: [number, number][];
  } | null>(null);

  const [selectedCapturedPiece, setSelectedCapturedPiece] = useState<{
    pieceId: string;
    name: string;
    team: string;
    legalPlaces: [number, number][];
  } | null>(null);

  const [promotionDialog, setPromotionDialog] = useState<{
    x: number;
    y: number;
    pieceId: string;
  } | null>(null);

  const [plannedMove, setPlannedMove] = useState<(PlannedMove) | null>(null);

  useEffect(() => {
    if (gameState && plannedMove && gameState.board[plannedMove.y][plannedMove.x]?.id === plannedMove.targetPieceId) {
      setPlannedMove(null);
    }
  }, [gameState, plannedMove]);

  const handleAction = (action: SendAction, name: string, team: string, promote: boolean) => {
    setPlannedMove({
      ...action,
      name,
      team,
      promote: action.promote || promote,
    });
    takeAction(action);
  };

  const handleSelectAndMove = (x: number, y: number, cell: BoardCell) => {
    if (cell?.name) {
      setTouchedPiece(cell.name as Piece);
    } else {
      setTouchedPiece(null);
    }

    if (gameState && selectedPiece && selectedPiece.legalMoves.some(([nx, ny]) => nx === x && ny === y)) {
      // 成れるかどうかを確認
      const { size } = gameState.boardSettings;
      const { team, promoted, promotable, promoteLine, immobileRow } = selectedPiece.piece;

      const isOverLine = (y: number, line: number) => {
        return team === "white" ? line > y : size - line <= y;
      };

      const isPromotable = promotable && !promoted && promoteLine &&
        (isOverLine(y, promoteLine) || isOverLine(selectedPiece.y, promoteLine)) &&
        gameState.turn.player === team;

      if (immobileRow && isOverLine(y, immobileRow)) {
        handleAction({
          targetPieceId: selectedPiece.piece.id,
          actionType: "move",
          promote: true,
          x,
          y,
        }, selectedPiece.piece.name, selectedPiece.piece.team, selectedPiece.piece.promoted);
      } else if (isPromotable) {
        setPromotionDialog({ x, y, pieceId: selectedPiece.piece.id });
        return;
      } else {
        handleAction({
          targetPieceId: selectedPiece.piece.id,
          actionType: "move",
          promote: false,
          x,
          y,
        }, selectedPiece.piece.name, selectedPiece.piece.team, selectedPiece.piece.promoted);
      }

      setSelectedPiece(null);
      setSelectedCapturedPiece(null);
    } else if (selectedCapturedPiece && selectedCapturedPiece.legalPlaces.some(([nx, ny]) => nx === x && ny === y)) {
      handleAction({
        targetPieceId: selectedCapturedPiece.pieceId,
        actionType: "place",
        promote: false,
        x,
        y,
      }, selectedCapturedPiece.name, selectedCapturedPiece.team, false);
      setSelectedPiece(null);
      setSelectedCapturedPiece(null);
    } else if (gameState) {
      setSelectedPiece(() => {
        if (cell && cell.team === gameState.turn.player) {
          return {
            piece: cell,
            x,
            y,
            legalMoves: gameState.legalActions[cell.id].moves,
          };
        } else {
          return null;
        }
      });
      setSelectedCapturedPiece(null);
    }
  };

  const handlePromoteDecision = (promote: boolean) => {
    if (promotionDialog && selectedPiece) {
      handleAction({
        targetPieceId: promotionDialog.pieceId,
        actionType: "move",
        promote,
        x: promotionDialog.x,
        y: promotionDialog.y,
      }, selectedPiece.piece.name, selectedPiece.piece.team, selectedPiece.piece.promoted);
    }
    setSelectedPiece(null);
    setSelectedCapturedPiece(null);
    setPromotionDialog(null);
  };

  const handleCapturedPieceClick = (pieceId: string, name: string, team: string) => {
    setTouchedPiece(name as Piece);
    if (gameState && gameState.turn.player === team) {
      if (pieceId !== selectedCapturedPiece?.pieceId) {
        const legalPlaces = gameState.legalActions[pieceId]?.places || [];
        setSelectedCapturedPiece({ pieceId, name, team, legalPlaces });
      } else {
        setSelectedCapturedPiece(null);
      }
      setSelectedPiece(null);
    }
  };

  if (!gameState) {
    return "初期化を行ってください";
  }

  return (
    <Container>
      <Heading>Chesshogi</Heading>
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
