import { Text, Heading, Box, Flex, Grid } from "@chakra-ui/react";
import React, { FC, PropsWithChildren } from "react";

const BasePage: FC<PropsWithChildren<{}>> = (props) => {
  return (
    <Grid
      templateRows="auto 1fr auto"
      alignItems="start"
      minHeight="100vh"
      width="100%"
      overflowX="hidden"
    >
      <Flex
        flexDirection="row"
        justifyContent="start"
        alignItems="center"
        width="100%"
        height={{ base: "3.5em", md: "4.5em" }}
        paddingBottom={{ base: ".25", md: ".5em" }}
        borderBottom="3px solid #000"
      >
        <Heading marginLeft="10px" size="2xl">
          Pumpkin
        </Heading>
      </Flex>
      <Box width="100%" height="100%">
        {props.children}
      </Box>
      <Flex
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-end"
        width="100%"
        height="3em"
        backgroundColor="black"
        padding="1em"
        color="white"
      >
        <Text>
          React + Ktor |{" "}
          <Text as="a" href="https://leonbusse.dev">
            Leon Busse
          </Text>
        </Text>
      </Flex>
    </Grid>
  );
};

export { BasePage };
