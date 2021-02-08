import { Box, Button, useTheme } from "@chakra-ui/react";
import React, { FC } from "react";
import { ReactComponent as PlaylistIcon } from "./queue.svg";
import { ReactComponent as MusicIcon } from "./music.svg";
import { ReactComponent as PlayIcon } from "./play.svg";
import { ReactComponent as PauseIcon } from "./pause.svg";

export enum MobileScreen { Listen, LikedTracks }

interface ShareBottomBarProps {
    togglePlayback: () => void;
    playing: boolean;
    onDone: () => void;
    activeMobileScreen: MobileScreen;
    setActiveMobileScreen: (active: MobileScreen) => void;
}

export const ShareBottomBar: FC<ShareBottomBarProps> = (props) => {
    const { togglePlayback, playing, onDone, activeMobileScreen, setActiveMobileScreen } = props;
    const theme = useTheme();

    return <Box
        width="100vw"
        height="5em"
        backgroundColor={theme.colors.primary}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding="0 1em">

        <ListenButton
            onClick={() => setActiveMobileScreen(MobileScreen.Listen)}
            active={activeMobileScreen === MobileScreen.Listen} />

        <PlayButton onClick={togglePlayback}
            active={playing} />
        <PlaylistButton
            onClick={() => setActiveMobileScreen(MobileScreen.LikedTracks)}
            active={activeMobileScreen === MobileScreen.LikedTracks} />
    </Box>
}


interface PlayButtonProps {
    onClick: () => void;
    active: boolean;
}

export const PlayButton: FC<PlayButtonProps> = (props) => {
    const { active, onClick } = props;
    const theme = useTheme();
    const ActiveIcon = active ? PauseIcon : PlayIcon;
    return <Button
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="7em"
        height="7em"
        borderRadius="1000px"
        borderColor={theme.colors.primary}
        borderWidth="3px"
        backgroundColor={theme.colors.secondary}
        marginBottom="2em"
        padding="0"
        background={theme.colors.secondary}
        _hover={{ background: theme.colors.accent }}
        onClick={onClick} >

        <ActiveIcon
            width="6em"
            height="6em"
            fill={theme.colors.primary} />
    </Button>;
}


interface ListenButtonProps {
    onClick: () => void;
    active: boolean;
}

export const ListenButton: FC<ListenButtonProps> = (props) => {
    const { active, onClick } = props;
    const theme = useTheme();
    return <Button
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="4em"
        height="4em"
        borderWidth="0"
        backgroundColor="transparent"
        padding="0"
        onClick={onClick}
        style={resetButtonCss}>

        <MusicIcon
            width="3em"
            height="3em"
            fill={active ? theme.colors.accent : theme.colors.secondary} />
    </Button>;
}


interface PlaylistButtonProps {
    onClick: () => void;
    active: boolean;
}

const resetButtonCss = { background: "transparent" };

export const PlaylistButton: FC<PlaylistButtonProps> = (props) => {
    const { active, onClick } = props;
    const theme = useTheme();
    return <Button
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderWidth="0"
        width="4em"
        height="4em"
        backgroundColor="transparent"
        padding="0"
        style={resetButtonCss}
        onClick={onClick}>

        <PlaylistIcon
            width="4em"
            height="4em"
            fill={active ? theme.colors.accent : theme.colors.secondary} />
    </Button>;
}