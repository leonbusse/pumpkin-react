import { FC } from "react";
import "./style.css";
interface PlayButtonProps {
  playing: boolean;
  onClick: () => void;
}

const PlayButton: FC<PlayButtonProps> = (props) => {
  return (
    <div className="PlayButton__wrapper">
      <button
        className={`PlayButton__button${props.playing ? " paused" : ""}`}
        onClick={props.onClick}
      ></button>
    </div>
  );
};

export { PlayButton };
