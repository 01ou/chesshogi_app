import styled from "styled-components";
import { playerShogiBoardTypes, playerChessBoardTypes } from "../constants/typeArray";
import { PlayerSetting, BoardType } from "../types/apiTypes";
import { boardNameJP } from "../constants/jp";

interface PlayerSettingsProps {
  playerName: string;
  playerSetting: PlayerSetting;
  boardType: BoardType;
  onSettingChange: (key: keyof PlayerSetting, value: any) => void;
  explanation: string;
}

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: bold;
  color: #333;
`;

const Select = styled.select`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #eee;
`;

const Explanation = styled.div`
  background-color: #eee;
  padding: 0.5rem;
  border-radius: 5px;
  color: #333;
  font-size: 0.9rem;
  margin-left: 70px;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SettingsContainer = styled.div`
  background-color: #eee;
  padding: 12px;
  border-radius: 4px;
`;

const SettingsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
`;

const PlayerSettings: React.FC<PlayerSettingsProps> = ({
  playerName,
  playerSetting,
  boardType,
  onSettingChange,
  explanation,
}) => {
  const getPlayerBoardTypeOptions = (selectedBoardType: BoardType) => {
    const types = selectedBoardType === "shogi" ? playerShogiBoardTypes : playerChessBoardTypes;
    return types.map((type) => (
      <option key={type} value={type}>
        {boardNameJP[type]}
      </option>
    ));
  };

  return (
    <FieldWrapper>
      <Label style={{ fontSize: "1.2rem" }}>{playerName}</Label>
      <SettingsContainer>
        <SettingsRow>
          <h4>駒の配置</h4>
          <Select
            value={playerSetting.boardType}
            onChange={(e) => onSettingChange("boardType", e.target.value)}
          >
            {getPlayerBoardTypeOptions(boardType)}
          </Select>
        </SettingsRow>
        <Explanation>{explanation}</Explanation>
      </SettingsContainer>
      <CheckboxWrapper>
        <input
          id={`piecePlaceableCheckbox-${playerName}`}
          type="checkbox"
          checked={playerSetting.piecePlaceable}
          onChange={(e) => onSettingChange("piecePlaceable", e.target.checked)}
        />
        <Label htmlFor={`piecePlaceableCheckbox-${playerName}`}>
          チームの駒: {playerSetting.piecePlaceable ? "配置可能" : "配置不可"}
        </Label>
      </CheckboxWrapper>
    </FieldWrapper>
  );
};

export default PlayerSettings;
