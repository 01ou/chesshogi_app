import React, { useState } from "react";
import styled from "styled-components";
import { initializeGame } from "../utils/api";
import { useGameContext } from "../contexts/GameContext";
import { useNavigate } from "react-router-dom";
import { BoardType, PlayerBoardType, PlayerSetting } from "../types/apiTypes";
import { boardTypes, playerChessBoardTypes, playerShogiBoardTypes } from "../constants/typeArray";

const GameControlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const BoardTypeSelect = styled.select`
  padding: 0.5rem;
  font-size: 1rem;
`;

const PlayerBoardTypeSelect = styled.select`
  padding: 0.5rem;
  font-size: 1rem;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CheckboxLabel = styled.label`
  font-size: 1rem;
  color: #333;
`;

const Checkbox = styled.input`
  width: 1rem;
  height: 1rem;
  cursor: pointer;
`;

const GameControls: React.FC = () => {
  const navigate = useNavigate();

  const [boardType, setBoardType] = useState<BoardType>("shogi");
  const [blackSetting, setBlackSetting] = useState<PlayerSetting>({
    name: "black",
    boardType: "shogi",
    piecePlaceable: true
  });

  const [whiteSetting, setWhiteSetting] = useState<PlayerSetting>({
    name: "black",
    boardType: "shogi",
    piecePlaceable: true
  });

  const { updateGameState } = useGameContext();

  const handleBoardTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBoardType = event.target.value as BoardType;
    setBoardType(selectedBoardType);
  
    // Update black and white settings based on the selected board type
    const defaultPiecePlaceable = isPiecePlaceableByDefault(selectedBoardType);
    setBlackSetting((prev) => ({
      ...prev,
      boardType: selectedBoardType === "shogi" ? "shogi" : "chess" as PlayerBoardType<BoardType>,
      piecePlaceable: defaultPiecePlaceable,
    }));
    setWhiteSetting((prev) => ({
      ...prev,
      boardType: selectedBoardType === "shogi" ? "shogi" : "chess" as PlayerBoardType<BoardType>,
      piecePlaceable: defaultPiecePlaceable,
    }));
  };

  const handleBlackBoardTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBlackSetting(prev => ({
      ...prev,
      boardType: event.target.value as PlayerBoardType<BoardType>,
      piecePlaceable: isPiecePlaceableByDefault(event.target.value as PlayerBoardType<BoardType>)
    }))
  };

  const handleWhiteBoardTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setWhiteSetting(prev => ({
      ...prev,
      boardType: event.target.value as PlayerBoardType<BoardType>,
      piecePlaceable: isPiecePlaceableByDefault(event.target.value as PlayerBoardType<BoardType>)
    }))
  };

  const isPiecePlaceableByDefault = (boardType: PlayerBoardType<BoardType>) => {
    return boardType === "shogi" || boardType === "narrowShogi" || boardType === "replaceChess";
  };  

  const handleInitialize = async () => {
    try {
      const response = await initializeGame({
        boardType,
        white: {
          ...whiteSetting
        },
        black: {
          ...blackSetting
        },
      });

      updateGameState();

      console.log("Game initialized successfully!", response?.data);
      navigate("/game");
    } catch (error) {
      console.error("Error initializing game:", error);
      alert("Failed to initialize the game.");
    }
  };

  // Generate options for board type selection based on BoardType enum
  const boardTypeOptions = boardTypes.map((boardTypeValue) => (
    <option key={boardTypeValue} value={boardTypeValue}>
      {boardTypeValue}
    </option>
  ));

  // Generate options for player board type selection based on BoardType and PlayerBoardType
  const getPlayerBoardTypeOptions = (selectedBoardType: BoardType) => {
    return (selectedBoardType === "shogi" ? playerShogiBoardTypes : playerChessBoardTypes)
      .map((boardTypeValue) => (
        <option key={boardTypeValue} value={boardTypeValue}>
          {boardTypeValue}
        </option>
      ));
  };

  const blackBoardTypeOptions = getPlayerBoardTypeOptions(boardType);
  const whiteBoardTypeOptions = getPlayerBoardTypeOptions(boardType);

  return (
    <GameControlsWrapper>
      <h2>Initialize Game</h2>
  
      <label>Board</label>
      <BoardTypeSelect value={boardType} onChange={handleBoardTypeChange}>
        {boardTypeOptions}
      </BoardTypeSelect>
  
      <label>Black Player</label>
      <PlayerBoardTypeSelect value={blackSetting.boardType} onChange={handleBlackBoardTypeChange}>
        {blackBoardTypeOptions}
      </PlayerBoardTypeSelect>
  
      <CheckboxWrapper>
        <Checkbox
          type="checkbox"
          checked={blackSetting.piecePlaceable ?? false}
          onChange={(e) =>
            setBlackSetting((prev) => ({
              ...prev,
              piecePlaceable: e.target.checked,
            }))
          }
        />
        <CheckboxLabel>Can Place Pieces</CheckboxLabel>
      </CheckboxWrapper>
  
      <label>White Player</label>
      <PlayerBoardTypeSelect value={whiteSetting.boardType} onChange={handleWhiteBoardTypeChange}>
        {whiteBoardTypeOptions}
      </PlayerBoardTypeSelect>
  
      <CheckboxWrapper>
        <Checkbox
          type="checkbox"
          checked={whiteSetting.piecePlaceable ?? false}
          onChange={(e) =>
            setWhiteSetting((prev) => ({
              ...prev,
              piecePlaceable: e.target.checked,
            }))
          }
        />
        <CheckboxLabel>Can Place Pieces</CheckboxLabel>
      </CheckboxWrapper>
  
      <Button onClick={handleInitialize}>Initialize Game</Button>
    </GameControlsWrapper>  
  )
};

export default GameControls;