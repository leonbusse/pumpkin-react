import { Button, useTheme } from "@chakra-ui/react";
import React, { FC } from "react";
import { ReactComponent as DeleteIcon } from "./delete.svg";

export const DeleteButton: FC<any> = (props) => {
  const { onClick, ...otherProps } = props;
  const theme = useTheme();
  return (
    <Button
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="3em"
      height="3em"
      backgroundColor={theme.colors.secondary}
      padding="0"
      background={theme.colors.secondary}
      _hover="transparent"
      _active="transparent"
      _focus="transparent"
      onClick={onClick}
      {...otherProps}
    >
      <DeleteIcon width="3em" height="3em" fill={theme.colors.primary} />
    </Button>
  );
};
