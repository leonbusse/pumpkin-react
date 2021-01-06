import { Grid } from "@chakra-ui/react";
import React, { useState } from "react";
import { Button } from "../../components/Button";
import { useDialog } from "react-st-modal";
import { TextInput } from "../TextInput";

export function CreatePlaylistDialogContent() {
  const dialog = useDialog();
  const [value, setValue] = useState("");

  // TODO: Enter does not work
  return (
    <Grid as="form" padding="2em" rowGap="2em" justifyItems="center">
      <TextInput
        label="Playlist Name"
        onChange={(e: any) => {
          setValue(e.target.value);
        }}
      />
      <Button
        type="submit"
        lineHeight="1.2"
        fontWeight="600"
        height="3rem"
        minWidth="3rem"
        fontSize="1.125rem"
        borderRadius="0.375rem"
        paddingLeft="1.5rem"
        paddingRight="1.5rem"
        onClick={() => {
          if (value && value.length > 0) {
            dialog.close(value);
          }
        }}
      >
        Create
      </Button>
    </Grid>
  );
}
