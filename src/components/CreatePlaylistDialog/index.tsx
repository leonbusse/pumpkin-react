import { Grid } from "@chakra-ui/react";
import React, { FC, useState } from "react";
import { Button } from "../../components/Button";
import { useDialog } from "react-st-modal";
import { TextInput } from "../TextInput";

export const CreatePlaylistDialogContent: FC = () => {
  const dialog = useDialog();
  const [value, setValue] = useState("");

  return (
    <Grid
      as="form"
      // eslint-disable-next-line no-script-url
      action="javascript:void(0);"
      padding="2em"
      rowGap="2em"
      justifyItems="center"
    >
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
        fontSize="1.25rem"
        borderWidth="0"
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
};
