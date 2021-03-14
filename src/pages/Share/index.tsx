import React, { FC, useState, useContext, useCallback } from "react";
import { Redirect, useParams } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import {
  PumpkinTrack,
  createPlaylist,
} from "../../api/pumpkin";
import { Loading } from "../../components/Loading";
import { globalSetters, GlobalStateContext } from "../../state";
import { CustomDialog, StaticDialog } from "react-st-modal";
import { CreatePlaylistDialogContent } from "../../components/CreatePlaylistDialog";
import { LoginRedirect } from "../../components/LoginRedirect";
import { MobileScreen, ShareBottomBar } from "../../components/ShareBottomBar";
import { usePlayer, useSharePageData, useUnlockedAudio } from "./hooks";
import { ListenScreen } from "./ListenScreen";
import { OverviewScreen } from "./OverviewScreen";
import { useOnboardingScreen } from "../../components/OnboardingDialog";
import { animated, useTransition } from "react-spring";

interface SharePagePathParams {
  id: string;
}

export const SharePage: FC = () => {
  const { id: shareId } = useParams<SharePagePathParams>();
  const globalState = useContext(GlobalStateContext);
  const spotifyAccessToken = globalState.spotify.accessToken;

  const [trackIndex, setTrackIndex] = useState<number>(0);
  const [done, setDone] = useState(false);
  const [activeMobileScreen, setActiveMobileScreen] = useState<MobileScreen>(MobileScreen.Listen);

  const {
    userId,
    tracks,
    libraryUser,
    ratedAllTracks,
    error,
  } = useSharePageData(shareId, trackIndex);

  const currentTrack = tracks && tracks[trackIndex];
  const nextTrack = tracks && tracks[trackIndex + 1];

  useUnlockedAudio()

  const { togglePlayback, playing, setPlayling, audioPlayerRef } = usePlayer(trackIndex);

  useOnboardingScreen();

  /** 
   * callbacks
   */

  const onSwipe = (direction: string) => {
    if ((direction === "up" || direction === "right") && userId && shareId && currentTrack) {
      likeTrack(shareId, currentTrack);
    } else {
    }
  };

  const onCardLeftScreen = async (myIdentifier: string) => {
    setTrackIndex(trackIndex + 1);
  };

  function likeTrack(libraryUserId: string, track: PumpkinTrack) {
    const likes = globalState.pumpkin.likes;
    const previousLikes = likes[libraryUserId]?.filter(t => t.id !== track.id) || [];
    const newLikes = { ...likes, [libraryUserId]: [...previousLikes, track] };
    globalSetters.setPumpkinState({
      likes: newLikes,
    });
  }

  function removeLikedTracks(libraryUserId: string, tracks: PumpkinTrack[]) {
    const likes = globalState.pumpkin.likes;
    const previousLikes = likes[libraryUserId] || [];
    const newLikes = { ...likes, [libraryUserId]: previousLikes.filter(t => !tracks.includes(t)) };
    globalSetters.setPumpkinState({
      likes: newLikes,
    });
  }

  const onDelete = (tracks: PumpkinTrack[]) => removeLikedTracks(shareId, tracks);

  const onCreatePlaylist = useCallback(async (playlistName: string) => {
    if (spotifyAccessToken && userId && libraryUser) {
      const success = await createPlaylist(
        userId,
        libraryUser.id,
        playlistName,
        globalState.pumpkin.likes[shareId].map(track => track.id),
        spotifyAccessToken,
      );
      if (!success) {
        return;
      }

      const updatedState = { likes: { ...globalState.pumpkin.likes } }
      delete updatedState.likes[shareId]
      globalSetters.setPumpkinState(updatedState);
      setDone(true);
    } else {
      throw Error(
        "Playlist could not be created. Spotify token or user ID not available."
      );
    }
  }, [globalState.pumpkin.likes, libraryUser, shareId, spotifyAccessToken, userId]);

  const onButtonDone = useCallback(async (closable?: boolean) => {
    const playlistName = await CustomDialog(<CreatePlaylistDialogContent />, {
      title: "Create Playlist",
      showCloseIcon: closable || true,
    });
    if (playlistName && typeof playlistName === "string") {
      onCreatePlaylist(playlistName);
    }
  }, [onCreatePlaylist]);

  const transitions = useTransition(activeMobileScreen, null, {
    from: { opacity: 0, transform: `translate3d(${activeMobileScreen === MobileScreen.Listen ? -400 : 400}px, 0, 0)` },
    enter: { opacity: 1, transform: `translate3d(0vw, 0, 0)` },
    leave: { opacity: 0, transform: `translate3d(${activeMobileScreen === MobileScreen.Listen ? 400 : -400}px, 0, 0)` },
  });


  /** 
   * early returns 
   */

  if (window.location.search.includes("action=createPlaylist")) {
    const afterPlaylistSplit = window.location.search.split("playlistName=", 2)[1] || "";
    const playlistName = decodeURIComponent(afterPlaylistSplit.split("=")[0] || "");
    (async () => { onCreatePlaylist(playlistName) })()
    return <></>;
  }

  if (!spotifyAccessToken) {
    return <LoginRedirect />;
  }

  if (done) {
    return <Redirect to="/playlist-created" />;
  }

  if (ratedAllTracks) {
    // TODO: only if there are liked tracks, else there are no tracks, so cancel everything
    return (
      <StaticDialog
        isOpen={true}
        title="Create Playlist"
        onAfterClose={(playlistName) => {
          if (playlistName && typeof playlistName === "string") {
            onCreatePlaylist(playlistName);
          }
        }}
      >
        <CreatePlaylistDialogContent />
      </StaticDialog>
    );
  }


  /** 
   * rendering
   */

  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100vh"
      overflow="hidden"
    >
      <Loading
        condition={() =>
          currentTrack && userId && libraryUser && shareId ? true : false
        }
        error={() => error}
      >
        {currentTrack && userId && libraryUser && shareId && (
          <Flex
            flexDirection="column"
            justifyContent="start"
            alignItems="center"
            width="100%"
            height="100%">

            <Box
              width="100%"
              flex="1"
              maxHeight="calc(100vh - 5em)"
              position="relative">

              {transitions.map(({ item, key, props }) =>
                <animated.div style={{
                  ...props,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%"
                }}>
                  {item === MobileScreen.Listen
                    ? <ListenScreen
                      libraryUser={libraryUser}
                      currentTrack={currentTrack}
                      onSwipe={onSwipe}
                      onCardLeftScreen={onCardLeftScreen}
                      nextTrack={nextTrack}
                    />
                    :
                    <OverviewScreen
                      onDone={onButtonDone}
                      onDelete={onDelete}
                      likes={globalState.pumpkin.likes[shareId]} />}
                </animated.div>
              )}
            </Box>
            <audio
              src={currentTrack.previewUrl as string}
              ref={audioPlayerRef}
              onEnded={() => setPlayling(false)}
            />
            <ShareBottomBar
              togglePlayback={togglePlayback}
              playing={playing}
              activeMobileScreen={activeMobileScreen}
              setActiveMobileScreen={setActiveMobileScreen} />
          </Flex>
        )}
      </Loading>
    </Flex>
  );
};