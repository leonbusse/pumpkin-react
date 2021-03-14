import React, { FC, useRef, useState } from "react";
import { Box, Flex, Heading, Spacer, Text, useTheme } from "@chakra-ui/react";
import { PumpkinTrack, PumpkinUser } from "../../api/pumpkin";
import { SwipeCard } from "../../components/SwipeCard";
import { HelpIcon } from "../../components/OnboardingDialog";
import { Button } from "../../components/Button";
import { SongSwiper } from "../../components/SongSwiper";
import { FadeOut } from "../../components/animation/fade";

interface ListenScreenProps {
  libraryUser: PumpkinUser;
  currentTrack: PumpkinTrack;
  onSwipe: (direction: string) => void;
  onCardLeftScreen: (myIdentifier: string) => Promise<void>;
  nextTrack: PumpkinTrack;
}

export const ListenScreen: FC<ListenScreenProps> = (props) => {
  const {
    libraryUser,
    currentTrack,
    onSwipe,
    onCardLeftScreen,
    nextTrack,
  } = props;
  const theme = useTheme();
  const [isInitialCardSinceMount, setInitialCardSinceMount] = useState(true);
  const swiperRef = useRef<any>();

  const onSwipeInner = (direction: string) => {
    setInitialCardSinceMount(false);
    onSwipe(direction);
  };

  return (
    <Flex
      as="section"
      flexDirection="column"
      justifyContent="start"
      alignItems="center"
      width="100%"
      height="100%"
      padding="2em 0 3em 0"
    >
      <Flex flexDirection="row" width="100%" padding="0 .75em">
        <Box width="2.5em" />
        <Heading as="a" href="/" margin="auto" textAlign="center" size="2xl">
          ListenUp
        </Heading>
        <HelpIcon />
      </Flex>
      <Text
        width="100%"
        textAlign="center"
        paddingLeft="10px"
        fontSize="xl"
        marginTop="1em"
      >
        {"This is "}
        <Text as="span" color={theme.colors.accent}>
          {libraryUser.displayName}
        </Text>
        's library
      </Text>
      <Spacer />
      <Flex
        flexDirection="column"
        justifyContent="start"
        alignItems="center"
        width="100%"
      >
        <Box position="relative" key={currentTrack.id}>
          {nextTrack && (
            <>
              <Box position="absolute" top="0">
                <SwipeCard track={nextTrack} />
              </Box>
              <CardBlur />
            </>
          )}
          <SongSwiper
            track={currentTrack}
            onSwipe={onSwipeInner}
            onCardLeftScreen={onCardLeftScreen}
            swiperRef={swiperRef}
          />
          <FadeOut disabled={isInitialCardSinceMount}>
            <CardBlur />
          </FadeOut>
        </Box>
      </Flex>
      <Spacer />
      <Flex>
        <Button
          borderWidth="0"
          borderRadius="0.375rem"
          minWidth="6em"
          marginRight="1em"
          background="translucent"
          onClick={() => swiperRef.current.swipe("left")}
        >
          Dislike
        </Button>
        <Button
          borderWidth="0"
          borderRadius="0.375rem"
          minWidth="6em"
          background="translucent"
          onClick={() => swiperRef.current.swipe("right")}
        >
          Like
        </Button>
      </Flex>
      <Spacer />
    </Flex>
  );
};

const CardBlur: FC = (props) => {
  return (
    <Box
      pointerEvents="none"
      position="absolute"
      top="0"
      width="100%"
      height="100%"
      borderRadius="10px"
      background="#00000088"
    />
  );
};
