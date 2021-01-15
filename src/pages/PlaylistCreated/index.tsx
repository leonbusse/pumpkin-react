import React, { FC } from "react";
import { Flex, Heading, Text, useTheme } from "@chakra-ui/react";
import { Button } from "../../components/Button";
import { BasePage } from "../../components/BasePage";
import { ExternalLink } from "../../components/ExternalLink";

export const PlaylistCreatedPage: FC = () => {
  const theme = useTheme();
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
          marginBottom=".5em"
        >
          A playlist has been created
        </Heading>
        <Text fontSize="xl" marginBottom="2em">
          Have at look at your{" "}
          <ExternalLink
            href="https://open.spotify.com/"
            color={theme.colors.colorAccent}
          >
            Spotify library
          </ExternalLink>
          !
        </Text>
        <Button as="a" href="/" width="8em" height="2.6em">
          Back
        </Button>
      </Flex>
    </BasePage>
  );
};
