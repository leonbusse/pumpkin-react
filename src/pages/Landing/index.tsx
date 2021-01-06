import React, { useContext } from "react";
import { getSpotifyLoginUrl } from "../../api/spotify";
import { GlobalStateContext } from "../../state";
import { Button } from "../../components/Button";
import { Text, Heading, Box, Flex, Spacer } from "@chakra-ui/react";

function LandingPage() {
  const spotifyState = useContext(GlobalStateContext).spotify;

  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Box as="section" maxW="32rem" textAlign="center" maxWidth="80vw">
        <Heading mb={4} size="4xl">
          Pumpkin
        </Heading>
        <Text fontSize="3xl">Share your Spotify library with friends</Text>
        <Spacer height="3em" />
        <Button
          as="a"
          href={
            spotifyState.accessToken ? "/create-link" : getSpotifyLoginUrl()
          }
        >
          Share
        </Button>
      </Box>
    </Flex>
  );
}

export { LandingPage };
