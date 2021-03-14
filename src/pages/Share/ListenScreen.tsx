import React, { FC, useEffect, useRef, useState } from "react";
import { Box, Flex, Heading, Spacer, Text, useTheme } from "@chakra-ui/react";
import {
    PumpkinTrack,
    PumpkinUser,
} from "../../api/pumpkin";
import { SwipeCard } from "../../components/SwipeCard";
import { HelpIcon } from "../../components/OnboardingDialog";
import { Button } from "../../components/Button";
import "./test.css";
import { SongSwiper2 } from "../../components/SongSwiper2";
import { animated, interpolate, useSpring, useTransition } from "react-spring";


interface ListenScreenProps {
    libraryUser: PumpkinUser;
    currentTrack: PumpkinTrack;
    onSwipe: (direction: string) => void;
    onCardLeftScreen: (myIdentifier: string) => Promise<void>;
    nextTrack: PumpkinTrack;
}


export const ListenScreen: FC<ListenScreenProps> = (props) => {
    const { libraryUser, currentTrack, onSwipe, onCardLeftScreen, nextTrack } = props;
    const theme = useTheme();

    const swiperRef = useRef<any>()

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
            <Flex
                flexDirection="row"
                width="100%"
                padding="0 .75em">
                <Box width="2.5em" />
                <Heading as="a"
                    href="/"
                    margin="auto"
                    textAlign="center"
                    size="2xl">
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
                as="section"
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
                            <Blur />
                        </>
                    )}
                    <SongSwiper2
                        track={currentTrack}
                        onSwipe={onSwipe}
                        onCardLeftScreen={onCardLeftScreen}
                        swiperRef={swiperRef}
                    />
                    <FadeOutBlur key={currentTrack.id} />
                </Box>
            </Flex>
            <Spacer />
            <Flex >
                <Button
                    borderWidth="0"
                    borderRadius="0.375rem"
                    minWidth="6em"
                    marginRight="1em"
                    background="translucent"
                    onClick={() => swiperRef.current.swipe("left")}>Dislike</Button>
                <Button
                    borderWidth="0"
                    borderRadius="0.375rem"
                    minWidth="6em"
                    background="translucent"
                    onClick={() => swiperRef.current.swipe("right")}>Like</Button>
            </Flex>
            <Spacer />
        </Flex>
    );
}


const Blur: FC = (props) => {
    return <Box
        pointerEvents="none"
        position="absolute"
        top="0"
        width="100%"
        height="100%"
        borderRadius="10px"
        background="#00000088" />
}

const FadeOutBlur: FC = (props) => {
    const fadeOutTransition = useFadeOut();
    return <>
        {fadeOutTransition.map(({ item, props, key }) => (
            <animated.div
                key={key}
                style={{ ...props }}
            >
                <Blur />
            </animated.div>
        ))}
    </>
}


function useFadeOut() {
    const fadeOutTransition = useTransition(0, i => i, {
        from: { opacity: 1 },
        enter: { opacity: 0 },
        leave: { opacity: 0 },
        config: { tension: 220, friction: 120 },
    });
    return fadeOutTransition;
}