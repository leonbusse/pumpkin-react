import React, { FC } from "react";
import { Button } from "../../components/Button";
import { Text, Heading, Box, Flex, Spacer } from "@chakra-ui/react";

export const LandingPage: FC = () => {
  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Box as="section" maxW="32rem" textAlign="center" maxWidth="80vw">
        <Heading mb={4} size="4xl">
          ListenUp
        </Heading>
        <Text fontSize="3xl">Share your Spotify library with friends</Text>
        <Spacer height="3em" />
        <Button as="a" href="/create-link">
          Share
        </Button>
      </Box>
    </Flex>
  );
};
