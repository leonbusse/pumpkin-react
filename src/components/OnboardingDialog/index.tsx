import React, { FC, useEffect } from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { CustomDialog, useDialog } from "react-st-modal";
import { Button } from "../Button";
import { ReactComponent as QuestionIcon } from "./question.svg";
import { ReactComponent as PlaylistIcon } from "./../ShareBottomBar/queue.svg";

export const HelpIcon: FC = () => {
    return (
        <QuestionIcon
            cursor="pointer"
            width="2.5em"
            height="2.5em"
            onClick={() => showOnboardingScreen()} />
    )
}

export function useOnboardingScreen() {
    useEffect(() => { if (isFirstVisit()) { showOnboardingScreen() } }, []);
}

function showOnboardingScreen() {
    CustomDialog(<OnboardingDialogContent />, { title: "", showCloseIcon: false });
}

const OnboardingDialogContent: FC = () => {
    const dialog = useDialog();
    return (<Box padding="2em">
        <Heading
            fontSize="1.5em">Welcome to ListenUp</Heading>
        <Box height=".75em" />
        <Text>Like a song by swiping it to the right, discard it by swiping left.</Text>
        <Box height=".75em" />
        <Text>{"You can review and remove likes on the overview screen "}
            <Box as="span" display="inline-block" verticalAlign="middle">
                <PlaylistIcon
                    width="1.3em"
                    height="1.3em"
                    fill="black" />
            </Box>
                . When you are done listening, add all liked songs to your Spotify library!</Text>
        <Box height=".75em" />
        <Flex width="100%">
            <Button
                lineHeight="1.2"
                fontWeight="600"
                height="3rem"
                marginLeft="auto"
                minWidth="3rem"
                fontSize="1.25rem"
                borderWidth="0"
                borderRadius="0.375rem"
                paddingLeft="1.5rem"
                paddingRight="1.5rem"
                onClick={() => { dialog.close() }}>Got it</Button>
        </Flex>
    </Box>);
}

function isFirstVisit(): boolean {
    try {
        const storageValue = localStorage.getItem("visitCount");
        const visitCount = (storageValue && parseInt(storageValue)) || 0;
        localStorage.setItem("visitCount", `${visitCount + 1}`);
        return visitCount === 0;
    } catch (e) {
        return false;
    }
}