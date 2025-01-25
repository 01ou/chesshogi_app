import { useEffect, useState } from "react";
import {
  DEFAULT_CHESS_BLACK_CELL_COLOR,
  DEFAULT_CHESS_WHITE_CELL_COLOR,
  DEFAULT_SHOGI_CELL_COLOR,
  MOVEABLE_CELL_COLOR,
  PLACEABLE_CELL_COLOR,
  SELECTED_PIECE_CELL_COLOR,
} from "../constants/color";
import { PlayerBoardType } from "../types/apiTypes";
import { BoardSettings } from "../types/GameTypes";

const useCellColor = (boardSettings: BoardSettings) => {
  const [boardPair, setBoardPair] = useState<string>("");
  const [randomBoardAssignments, setRandomBoardAssignments] = useState<Record<string, PlayerBoardType>>({});

  const isShogi = (type: PlayerBoardType) =>
    ["shogi", "narrowShogi", "replaceChess"].includes(type);

  const defaultColors = {
    shogi: DEFAULT_SHOGI_CELL_COLOR,
    chess: (x: number, y: number) =>
      (x + y) % 2 === 0 ? DEFAULT_CHESS_WHITE_CELL_COLOR : DEFAULT_CHESS_BLACK_CELL_COLOR,
  };

  const getRandomBoardType = (x: number, y: number) => {
    const dictKey = `${x}-${y}`;
    if (randomBoardAssignments[dictKey]) return randomBoardAssignments[dictKey];

    const centerStart = Math.floor((boardSettings.size - (boardSettings.size === 9 ? 3 : 2)) / 2);
    const centerEnd = centerStart + (boardSettings.size === 9 ? 3 : 2);

    const randomThreshold =
      y === centerStart ? 0.3 : y === centerEnd - 1 ? 0.7 : 0.5;

    const randomBoardType =
      Math.random() > randomThreshold
        ? boardSettings.blackBoard
        : boardSettings.whiteBoard;

    setRandomBoardAssignments((prev) => ({
      ...prev,
      [dictKey]: randomBoardType,
    }));

    return randomBoardType;
  };

  const getBoardType = (x: number, y: number) => {
    const centerStart = Math.floor((boardSettings.size - (boardSettings.size === 9 ? 3 : 2)) / 2);
    const centerEnd = centerStart + (boardSettings.size === 9 ? 3 : 2);

    if (y < centerStart) return boardSettings.blackBoard;
    if (y >= centerEnd) return boardSettings.whiteBoard;

    return getRandomBoardType(x, y);
  };

  const getCellColors = (x: number, y: number) => {
    const boardType = getBoardType(x, y);

    return {
      selected: SELECTED_PIECE_CELL_COLOR,
      move: MOVEABLE_CELL_COLOR,
      place: PLACEABLE_CELL_COLOR,
      default: isShogi(boardType) ? defaultColors.shogi : defaultColors.chess(x, y),
    };
  };

  useEffect(() => {
    const pair = `${boardSettings.blackBoard}_${boardSettings.whiteBoard}`;
    if (pair !== boardPair) {
      setBoardPair(pair);
      setRandomBoardAssignments({});
    }
  }, [boardSettings, boardPair]);

  return { getCellColors };
};

export default useCellColor;
