import React, { useState } from "react";
import {
  ModalButton,
  ModalContent,
  ModalFooter,
  useDialog,
} from "react-st-modal";
import "./style.css";

function CreatePlaylistDialogContent() {
  const dialog = useDialog();
  const [value, setValue] = useState();

  return (
    <div className="CreatePlaylistDialogContent__container">
      <ModalContent>
        <div className="input-container">
          <input
            type="text"
            required={true}
            onChange={(e: any) => {
              setValue(e.target.value);
            }}
          />
          <label>Name</label>
        </div>
      </ModalContent>
      <ModalFooter>
        <ModalButton
          onClick={() => {
            dialog.close(value);
          }}
        >
          Create
        </ModalButton>
      </ModalFooter>
    </div>
  );
}

export { CreatePlaylistDialogContent };
