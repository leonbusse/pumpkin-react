import React, { FC } from "react";
import { Box, Flex, Heading, Spacer, Text, useTheme } from "@chakra-ui/react";
import {
    PumpkinTrack,
    PumpkinUser,
} from "../../api/pumpkin";
import { SwipeCard } from "../../components/SwipeCard";
import { SongSwiper } from "../../components/SongSwiper";
import { HelpIcon } from "../../components/OnboardingDialog";


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
                <Box position="relative"
                    style={{ zIndex: 1000 }}>
                    <SongSwiper
                        track={currentTrack}
                        onSwipe={onSwipe}
                        onCardLeftScreen={onCardLeftScreen}
                    />
                    {nextTrack && (
                        <Box position="absolute" top="0" zIndex="-1">
                            <SwipeCard track={nextTrack} />
                        </Box>
                    )}
                </Box>
            </Flex>
            <Spacer />
        </Flex>
    );
}
