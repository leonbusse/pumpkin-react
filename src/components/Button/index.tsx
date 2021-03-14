import { Button as ChakraButton } from "@chakra-ui/react";

export const Button = (props: any) => {
  const { children, disabled, ...otherProps } = props;
  const hoverCss = {
    background: disabled ? "#ddd" : "black",
    color: disabled ? "#666" : "white",
    borderColor: disabled ? "#666" : "black",
  };
  return (
    <ChakraButton
      _hover={hoverCss}
      _active={hoverCss}
      color={disabled ? "#666" : "black"}
      background={disabled ? "#ddd" : "white"}
      border="solid"
      borderWidth="3px"
      pointerEvents={disabled ? "none" : "initial"}
      borderColor={disabled ? "#666" : "black"}
      size="lg"
      colorScheme="green"
      display="inline-grid"
      {...otherProps}
    >
      {children}
    </ChakraButton>
  );
};
