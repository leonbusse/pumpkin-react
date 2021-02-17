import React, { FC, useEffect } from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { CustomDialog, useDialog } from "react-st-modal";
import { Button } from "../Button";
import { ReactComponent as QuestionIcon } from "./question.svg";

export const HelpIcon: FC = () => {
    return (
        <QuestionIcon
            width="3em"
            height="3em"
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
            fontSize="1.5em">Welcome to ListenUp!</Heading>
        <Box height=".75em" />
        <Text>Like a song by swiping up or right, discard it by swiping down or left.</Text>
        <Box height=".75em" />
        <Text>You can check and remove likes on the overview screen. When you are done listening, add all liked songs to your Spotify library!</Text>
        <Box height=".75em" />
        <Flex width="100%">
            <Button
                lineHeight="1.2"
                fontWeight="600"
                height="3rem"
                marginLeft="auto"
                minWidth="3rem"
                fontSize="1.125rem"
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