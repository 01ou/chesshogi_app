import React, { useState } from "react";
import { BoardCell, PieceState } from "../types/GameTypes";
import CapturedPieces from "./CapturedPieces";
import Board from "./Board";
import { useGameContext } from "../contexts/GameContext";
import PromoteDialog from "./PromoteDialog";

interface GameProps {}

const Game: React.FC<GameProps> = () => {
  const { gameState, takeAction } = useGameContext();

  const [selectedPiece, setSelectedPiece] = useState<{
    piece: PieceState;
    x: number;
    y: number;
    legalMoves: [number, number][];
  } | null>(null);

  const [selectedCapturedPiece, setSelectedCapturedPiece] = useState<{
    pieceId: string;
    legalPlaces: [number, number][];
  } | null>(null);

  const [promotionDialog, setPromotionDialog] = useState<{
    x: number;
    y: number;
    pieceId: string;
  } | null>(null);

  const handleSelectAndMove = (x: number, y: number, cell: BoardCell) => {
    if (gameState && selectedPiece && selectedPiece.legalMoves.some(([nx, ny]) => nx === x && ny === y)) {
      // 成れるかどうかを確認
      const { size } = gameState.boardSettings;
      const { team, promoted, promotable, promoteLine, immobileRow } = selectedPiece.piece;

      const isOverLine = (y: number, line: number) => {
        return team === "white" ? line > y : size - line <= y;
      }

      const isPromotable = promotable && !promoted && promoteLine &&
        (isOverLine(y, promoteLine) || isOverLine(selectedPiece.y, promoteLine)) &&
        gameState.turn.player === team;

      if (immobileRow && isOverLine(y, immobileRow)) {
        takeAction({
          targetPieceId: selectedPiece.piece.id,
          actionType: "move",
          promote: true,
          x,
          y,
        })
      } else if (isPromotable) {
        setPromotionDialog({ x, y, pieceId: selectedPiece.piece.id });
      } else {
        takeAction({
          targetPieceId: selectedPiece.piece.id,
          actionType: "move",
          promote: false,
          x,
          y,
        });
      }

      setSelectedPiece(null);
      setSelectedCapturedPiece(null);
    } else if (selectedCapturedPiece && selectedCapturedPiece.legalPlaces.some(([nx, ny]) => nx === x && ny === y)) {
      takeAction({
        targetPieceId: selectedCapturedPiece.pieceId,
        actionType: "place",
        promote: false,
        x,
        y,
      });
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
    if (promotionDialog) {
      takeAction({
        targetPieceId: promotionDialog.pieceId,
        actionType: "move",
        promote,
        x: promotionDialog.x,
        y: promotionDialog.y,
      });
    }
    setPromotionDialog(null);
  };

  const handleCapturedPieceClick = (pieceId: string, team: string) => {
    if (gameState && gameState.turn.player === team) {
      if (pieceId !== selectedCapturedPiece?.pieceId) {
        const legalPlaces = gameState.legalActions[pieceId]?.places || [];
        setSelectedCapturedPiece({ pieceId, legalPlaces });
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
    <div>
      {promotionDialog && (
        <PromoteDialog onConfirm={handlePromoteDecision} />
      )}
      <Board
        board={gameState.board}
        moveMarks={selectedPiece?.legalMoves ?? []}
        placeMarks={selectedCapturedPiece?.legalPlaces ?? []}
        onCellClick={(x, y, cell) => handleSelectAndMove(x, y, cell)}
      />
      <CapturedPieces
        capturedPieces={gameState.capturedPieces}
        onPieceClick={handleCapturedPieceClick}
      />
    </div>
  );
};

export default Game;
