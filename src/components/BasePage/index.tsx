import { Text, Heading, Box, Flex, Grid } from "@chakra-ui/react";
import React, { FC, PropsWithChildren } from "react";
import { ExternalLink } from "../ExternalLink";

export const BasePage: FC<PropsWithChildren<{}>> = (props) => {
  return (
    <Grid
      templateRows="auto 1fr auto"
      alignItems="start"
      minHeight="100vh"
      width="100%"
      overflow="hidden"
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
        <Heading as="a" href="/" marginLeft="10px" size="2xl">
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
          <ExternalLink href="https://reactjs.org/">React</ExternalLink>
          {" + "}
          <ExternalLink href="https://ktor.io/">Ktor</ExternalLink>
          {" | View on "}
          <ExternalLink href="https://github.com/leonbusse/pumpkin">
            GitHub
          </ExternalLink>
          {" | "}
          <ExternalLink href="https://leonbusse.dev">Leon Busse</ExternalLink>
        </Text>
      </Flex>
    </Grid>
  );
};
