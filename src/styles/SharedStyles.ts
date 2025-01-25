import styled from "styled-components";

// セルのベーススタイル
export const CellBase = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #888;
`;

// ボードコンテナのスタイル
export const BoardContainer = styled.div`
  display: grid;
  gap: 2px;
  width: fit-content;
  margin: 0 auto;
`;

// 駒画像のスタイル
export const PieceImage = styled.img<{ opacity?: number }>`
  max-width: 90%;
  max-height: 90%;
  opacity: ${({ opacity }) => opacity || 1};
  transition: opacity 0.3s ease;
`;
