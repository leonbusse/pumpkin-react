import { Button as ChakraButton } from "@chakra-ui/react";

export const Button = (props: any) => {
  const { children, ...otherProps } = props;
  const hoverCss = {
    background: "black",
    color: "white",
    borderColor: "black",
  };
  return (
    <ChakraButton
      {...otherProps}
      _hover={hoverCss}
      _active={hoverCss}
      color="black"
      background="white"
      border="solid"
      size="lg"
      colorScheme="green"
      display="inline-grid"
    >
      {children}
    </ChakraButton>
  );
};
