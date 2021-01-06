import { FC } from "react";
import "./style.css";

interface TextInputProps {
  label: string;
  onChange: (e: any) => void;
}
export const TextInput: FC<TextInputProps> = (props) => {
  const { label, onChange } = props;
  return (
    <div className="input-container">
      <input type="text" required={true} onChange={onChange} />
      <label>{label}</label>
    </div>
  );
};
