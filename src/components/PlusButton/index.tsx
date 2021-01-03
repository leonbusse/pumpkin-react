import { FC } from "react";
import "./style.css";

interface PlusButtonProps {
  onClick: () => void;
}

const PlusButton: FC<PlusButtonProps> = (props) => {
  return (
    <div>
      <button className={`PlusButton__button`} onClick={props.onClick}></button>
    </div>
  );
};

export { PlusButton };
