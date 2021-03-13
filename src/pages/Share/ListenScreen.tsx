import React, { FC, useRef } from "react";
import { Box, Flex, Heading, Spacer, Text, useTheme } from "@chakra-ui/react";
import {
    PumpkinTrack,
    PumpkinUser,
} from "../../api/pumpkin";
import { SwipeCard } from "../../components/SwipeCard";
import { SongSwiper } from "../../components/SongSwiper";
import { HelpIcon } from "../../components/OnboardingDialog";
import { Button } from "../../components/Button";
import "./test.css";


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

    const swiperRef = useRef<any>();

    // useEffect(() => {
    //     console.log("trigger effect")
    //     onCardEnter();
    // }, [nextTrack]);

    const onCardLeftScreenInner = (myIdentifier: string) => {
        onCardEnter()
        onCardLeftScreen(myIdentifier)
    }

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
                <Box position="relative" >
                    <SongSwiper
                        track={currentTrack}
                        onSwipe={onSwipe}
                        onCardLeftScreen={onCardLeftScreenInner}
                        swiperRef={swiperRef}
                    />
                    <Blur id="blur" zIndex="1" />
                    {nextTrack && (
                        <>
                            <Box position="absolute" top="0" zIndex="-2">
                                <SwipeCard track={nextTrack} />
                            </Box>
                            <Blur zIndex="-1" blur />
                        </>
                    )}
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


const Blur: FC<{ blur?: boolean, zIndex?: string, id?: string }> = (props) => {
    const { blur, id, zIndex } = props;
    console.log("zIndex is ", zIndex)
    return <Box
        pointerEvents="none"
        zIndex={zIndex}
        id={id}
        position="absolute"
        top="0"
        width="100%"
        height="100%"
        borderRadius="10px"
        background={blur ? "#00000088" : "trasparent"} />
}

function onCardEnter() {
    console.log("enter anim");
    const anim = document.getElementById("blur")!!.animate({
        transform: ["translate(0px)", "translate(0px)"],
        background: ["#00000088", "#00000000"]
    }, 500);
    anim.play();
}
