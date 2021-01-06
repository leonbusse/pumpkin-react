import React, { useContext, useEffect, useState } from "react";
import { Flex, Heading } from "@chakra-ui/react";
import { Redirect } from "react-router-dom";
import { createShareLink } from "../../api/pumpkin";
import { globalSetters, GlobalStateContext, SpotifyState } from "../../state";
import { BasePage } from "../../components/BasePage";
import LoadingSpinner from "../../components/LoadingSpinner";

function CreateLinkPage() {
  const globalState = useContext(GlobalStateContext);
  const spotifyState: SpotifyState = globalState.spotify;
  const { setPumpkinState } = globalSetters;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (spotifyState.accessToken) {
        const shareLink = await createShareLink(spotifyState.accessToken);
        setPumpkinState({ shareLink: shareLink });
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!spotifyState.accessToken) {
    console.error("no Spotify accessToken available");
    return (
      <>
        <Redirect to="/login" />
      </>
    );
  }

  if (!loading) {
    return <Redirect to="/link-created" />;
  }
  return (
    <BasePage>
      <Flex
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100%"
        as="section"
      >
        <Heading
          size="xl"
          borderBottom="3px solid #000"
          paddingBottom="4px"
          marginBottom="1.5em"
        >
          Your link is being created...
        </Heading>
        <LoadingSpinner />
      </Flex>
    </BasePage>
  );
}

export { CreateLinkPage };
