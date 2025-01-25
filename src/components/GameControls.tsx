import React, { useState } from "react";
import styled from "styled-components";
import { initializeGame } from "../utils/api";
import { useGameContext } from "../contexts/GameContext";
import { useNavigate } from "react-router-dom";
import { BoardType, PlayerSetting } from "../types/apiTypes";
import { boardTypes } from "../constants/typeArray";
import { boardExplanations } from "../constants/jp";
import PlayerSettings from "./PlayerSettings";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  gap: 2rem;
  max-width: 800px;
  margin: auto;
  background-color: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const FormWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: bold;
  color: #555;
`;

const Select = styled.select`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const SettingsContainer = styled.div`
  background-color: #ddd;
  padding: 16px;
  border-radius: 6px;
`;

const GameControls: React.FC = () => {
  const navigate = useNavigate();
  const [boardType, setBoardType] = useState<BoardType>("shogi");
  const [blackSetting, setBlackSetting] = useState<PlayerSetting>({
    name: "black",
    boardType: "shogi",
    piecePlaceable: true,
  });
  const [whiteSetting, setWhiteSetting] = useState<PlayerSetting>({
    name: "white",
    boardType: "shogi",
    piecePlaceable: true,
  });

  const { updateGameState } = useGameContext();

  const handleBoardTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBoardType = event.target.value as BoardType;
    setBoardType(selectedBoardType);
    setBlackSetting((prev) => ({
      ...prev,
      boardType: selectedBoardType === "shogi" ? "shogi" : "chess",
      piecePlaceable: true,
    }));
    setWhiteSetting((prev) => ({
      ...prev,
      boardType: selectedBoardType === "shogi" ? "shogi" : "chess",
      piecePlaceable: true,
    }));
  };

  const handleSettingChange = (setter: React.Dispatch<React.SetStateAction<PlayerSetting>>) => (
    key: keyof PlayerSetting,
    value: any
  ) => {
    setter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleInitialize = async () => {
    try {
      await initializeGame({
        boardType,
        white: whiteSetting,
        black: blackSetting,
      });
      updateGameState();
      navigate("/game");
    } catch (error) {
      console.error("Error initializing game:", error);
      alert("Failed to initialize the game.");
    }
  };

  return (
    <Container>
      <Title>ゲームの設定</Title>
      <FormWrapper>
        <SettingsContainer>
          <FieldWrapper>
            <Label>盤面</Label>
            <Select value={boardType} onChange={handleBoardTypeChange}>
              {boardTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "shogi" ? "将棋" : "チェス"}
                </option>
              ))}
            </Select>
          </FieldWrapper>
        </SettingsContainer>

        <SettingsContainer>
          <PlayerSettings
            playerName="先手"
            playerSetting={blackSetting}
            boardType={boardType}
            onSettingChange={handleSettingChange(setBlackSetting)}
            explanation={boardExplanations[blackSetting.boardType]}
          />
        </SettingsContainer>

        <SettingsContainer>
          <PlayerSettings
            playerName="後手"
            playerSetting={whiteSetting}
            boardType={boardType}
            onSettingChange={handleSettingChange(setWhiteSetting)}
            explanation={boardExplanations[whiteSetting.boardType]}
          />
        </SettingsContainer>

        <Button onClick={handleInitialize}>Start Game!</Button>
      </FormWrapper>
    </Container>
  );
};

export default GameControls;
