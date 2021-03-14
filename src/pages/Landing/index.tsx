import React, { FC } from "react";
import { Button } from "../../components/Button";
import { Text, Heading, Box, Flex } from "@chakra-ui/react";
import { useFadeAndFlyIn } from "../../components/animation/fade";
import { animated } from "react-spring";

export const LandingPage: FC = () => {
  const items = [
    {
      key: 0,
      content: (
        <Heading mb={4} size="4xl">
          ListenUp
        </Heading>
      ),
    },
    {
      key: 1,
      content: (
        <Text fontSize="3xl">Share your Spotify library with friends</Text>
      ),
    },
    {
      key: 2,
      content: (
        <Button as="a" href="/create-link" marginTop="3em">
          Share
        </Button>
      ),
    },
  ];

  const transitionState = useFadeAndFlyIn(items);

  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Box as="section" maxW="32rem" textAlign="center" maxWidth="80vw">
        {transitionState.map(({ item, props: animProps, key }) => (
          <animated.div key={key} style={{ ...animProps }}>
            {item.content}
          </animated.div>
        ))}
      </Box>
    </Flex>
  );
};
