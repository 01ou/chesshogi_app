import React from "react";
import styled from "styled-components";

interface PromoteDialogProps {
  onConfirm: (promote: boolean) => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const DialogBox = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 300px;
  width: 90%;
`;

const Message = styled.p`
  font-size: 16px;
  margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  background-color: ${(props) => (props.color === "primary" ? "#007BFF" : "#6C757D")};
  color: white;

  &:hover {
    background-color: ${(props) => (props.color === "primary" ? "#0056b3" : "#5a6268")};
  }
`;

const PromoteDialog: React.FC<PromoteDialogProps> = ({ onConfirm }) => {
  return (
    <Overlay>
      <DialogBox>
        <Message>成りますか？</Message>
        <ButtonGroup>
          <Button color="primary" onClick={() => onConfirm(true)}>
            成る
          </Button>
          <Button color="secondary" onClick={() => onConfirm(false)}>
            成らない
          </Button>
        </ButtonGroup>
      </DialogBox>
    </Overlay>
  );
};

export default PromoteDialog;
