// useGameLogic.ts
import { useEffect, useState } from "react";
import { BoardCell, PieceState, PlannedMove } from "../types/GameTypes";
import { Piece } from "../types/Pieces";
import { SendAction } from "../types/apiTypes";
import { useGameContext } from "../contexts/GameContext";

export const useGameLogic = () => {
  const { gameState, aiAction, takeAction } = useGameContext();
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
  const [isAIResponds, setIsAIResponds] = useState(false);

  useEffect(() => {
    const targetPositionPieceId = (gameState && plannedMove) ? gameState.board[plannedMove.y][plannedMove.x]?.id : undefined;
    const aiPieceId = (gameState && aiAction) ? gameState.board[aiAction.to[1]][aiAction.to[0]]?.id : undefined;

    if (gameState && plannedMove && (targetPositionPieceId === plannedMove.targetPieceId || aiPieceId === targetPositionPieceId)) {
      setPlannedMove(null);
    }
  }, [gameState, aiAction, plannedMove]);

  const handleAction = (action: SendAction, name: string, team: string, promote: boolean, rearranged: boolean) => {
    setPlannedMove({
      ...action,
      name,
      team,
      promote: action.promote || promote,
      rearranged
    });
    takeAction(action);
  };

  const handleSelectAndMove = (x: number, y: number, cell: BoardCell) => {
    if (cell?.name) {
      if (cell.name === Piece.ChessPawn && cell.rearranged) {
        setTouchedPiece(Piece.ChessCrackedPawn);
      } else {
        setTouchedPiece(cell.name as Piece);
      }
    } else {
      setTouchedPiece(null);
    }

    if (gameState && selectedPiece && selectedPiece.legalMoves.some(([nx, ny]) => nx === x && ny === y)) {
      // Check for promotion or move
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
          isAIResponds,
          targetPieceId: selectedPiece.piece.id,
          actionType: "move",
          promote: true,
          x,
          y,
        }, selectedPiece.piece.name, selectedPiece.piece.team, selectedPiece.piece.promoted, selectedPiece.piece.rearranged);
      } else if (isPromotable) {
        setPromotionDialog({ x, y, pieceId: selectedPiece.piece.id });
        return;
      } else {
        handleAction({
          isAIResponds,
          targetPieceId: selectedPiece.piece.id,
          actionType: "move",
          promote: false,
          x,
          y,
        }, selectedPiece.piece.name, selectedPiece.piece.team, selectedPiece.piece.promoted, selectedPiece.piece.rearranged);
      }

      setSelectedPiece(null);
      setSelectedCapturedPiece(null);
    } else if (selectedCapturedPiece && selectedCapturedPiece.legalPlaces.some(([nx, ny]) => nx === x && ny === y)) {
      handleAction({
        isAIResponds,
        targetPieceId: selectedCapturedPiece.pieceId,
        actionType: "place",
        promote: false,
        x,
        y,
      }, selectedCapturedPiece.name, selectedCapturedPiece.team, false, true);
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
        isAIResponds,
        targetPieceId: promotionDialog.pieceId,
        actionType: "move",
        promote,
        x: promotionDialog.x,
        y: promotionDialog.y,
      }, selectedPiece.piece.name, selectedPiece.piece.team, selectedPiece.piece.promoted, selectedPiece.piece.rearranged);
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

  return {
    isAIResponds,
    gameState,
    touchedPiece,
    selectedPiece,
    selectedCapturedPiece,
    promotionDialog,
    plannedMove,
    setIsAIResponds,
    handleAction,
    handleSelectAndMove,
    handlePromoteDecision,
    handleCapturedPieceClick,
  };
};
