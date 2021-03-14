import { FC } from "react";
import "./style.css";

interface PlusButtonProps {
  onClick: () => void;
  active: boolean;
}

export const PlusButton: FC<PlusButtonProps> = (props) => {
  const { onClick, active } = props;
  return (
    <div>
      <button
        className={`PlusButton__button${active ? "" : " PlusButton__disabled"}`}
        onClick={onClick}
      ></button>
    </div>
  );
};
