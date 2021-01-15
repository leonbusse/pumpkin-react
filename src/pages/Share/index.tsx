import React, { FC, useEffect, useState, useRef, useContext } from "react";
import { Redirect, useParams } from "react-router-dom";
import {
  fetchTracks,
  fetchUserByShareId,
  PumpkinTrack,
  createPlaylist,
  PumpkinUser,
} from "../../api/pumpkin";
import { Loading } from "../../components/Loading";
import { SwipeCard } from "../../components/SwipeCard";
import { SongSwiper } from "../../components/SongSwiper";
import { PlayButton } from "../../components/PlayButton";
import { PlusButton } from "../../components/PlusButton";
import { globalSetters, GlobalStateContext } from "../../state";
import { CustomDialog, StaticDialog } from "react-st-modal";
import { CreatePlaylistDialogContent } from "../../components/CreatePlaylistDialog";
import { fetchLoggedInUser } from "../../api/spotify";
import { Box, Flex, Spacer, Text, useTheme } from "@chakra-ui/react";
import { BasePage } from "../../components/BasePage";
import { LoginRedirect } from "../../components/LoginRedirect";
import { useApiCall } from "../../util";

interface SharePagePathParams {
  id: string;
}

export const SharePage: FC = () => {
  const { id: shareId } = useParams<SharePagePathParams>();
  const theme = useTheme();
  const globalState = useContext(GlobalStateContext);
  const spotifyAccessToken = globalState.spotify.accessToken;

  const [trackIndex, setTrackIndex] = useState<number>(0);
  const [playing, setPlayling] = useState(false);
  const [done, setDone] = useState(false);
  const audioPlayer = useRef<HTMLAudioElement>(null);

  const {
    userId,
    tracks,
    libraryUser,
    ratedAllTracks,
    error,
  } = useSharePageData(shareId, trackIndex);

  const currentTrack = tracks && tracks[trackIndex];
  const nextTrack = tracks && tracks[trackIndex + 1];

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  // TODO: control player via useEffect only
  useEffect(() => {
    if (audioPlayer && audioPlayer.current) {
      if (playing) {
        audioPlayer.current.play();
      } else {
        audioPlayer.current.pause();
      }
    }
  }, [trackIndex, playing]);

  const onSwipe = (direction: string) => {
    if (direction === "right" && userId && shareId && currentTrack) {
      likeTrack(shareId, currentTrack.id);
    } else {
    }
  };

  const onCardLeftScreen = async (myIdentifier: string) => {
    setTrackIndex(trackIndex + 1);
  };

  const togglePlayback = () => {
    if (audioPlayer && audioPlayer.current) {
      if (audioPlayer.current.paused) {
        setPlayling(true);
      } else {
        setPlayling(false);
      }
    }
  };

  function likeTrack(libraryUserId: string, trackId: string) {
    const likes = globalState.pumpkin.likes;
    const previousLikes = likes[libraryUserId] || [];
    const newLikes = { ...likes, [libraryUserId]: [...previousLikes, trackId] };
    console.log("updated likes:", newLikes);
    globalSetters.setPumpkinState({
      likes: newLikes,
    });
  }

  const onCreatePlaylist = async (playlistName: string) => {
    if (spotifyAccessToken && userId && libraryUser) {
      const success = await createPlaylist(
        userId,
        libraryUser.id,
        playlistName,
        globalState.pumpkin.likes[shareId],
        spotifyAccessToken
      );
      if (!success) {
        return;
      }

      globalSetters.setPumpkinState({
        likes: { ...globalState.pumpkin.likes, [shareId]: [] },
      });
      setDone(true);
    } else {
      throw Error(
        "Playlist could not be created. Spotify token or user ID not available."
      );
    }
  };

  const onButtonDone = async (closable?: boolean) => {
    const playlistName = await CustomDialog(<CreatePlaylistDialogContent />, {
      title: "Create Playlist",
      showCloseIcon: closable || true,
    });
    if (playlistName && typeof playlistName === "string") {
      onCreatePlaylist(playlistName);
    }
  };

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

  return (
    <BasePage>
      <Flex
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Loading
          condition={() =>
            currentTrack && userId && libraryUser && shareId ? true : false
          }
          error={() => error}
        >
          {currentTrack && userId && libraryUser && shareId && (
            <>
              <Text
                width="100%"
                paddingLeft="10px"
                fontSize="2xl"
                margin=".25em 0 1em 0"
              >
                <Text as="span" color={theme.colors.accent}>
                  {libraryUser.displayName}
                </Text>
                's library
              </Text>
              <Spacer />
              <Box
                as="section"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                width="100%"
              >
                <Box position="relative">
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
                <audio
                  src={currentTrack.previewUrl as string}
                  ref={audioPlayer}
                  onEnded={() => setPlayling(false)}
                />
                <Flex flexDirection="row" padding="3em 0">
                  <PlayButton onClick={togglePlayback} playing={playing} />
                  <Box width="60px" />
                  <PlusButton onClick={onButtonDone} />
                </Flex>
              </Box>
              <Spacer />
            </>
          )}
        </Loading>
      </Flex>
    </BasePage>
  );
};

function useSharePageData(shareId: string, trackIndex: number) {
  const { user, error: userError } = useLoggedInUser();

  const { user: libraryUser, error: libraryUserError } = useUserDataByShareId(
    shareId
  );

  const { tracks, ratedAllTracks, error: trackError } = useTrackPagination(
    shareId,
    trackIndex
  );

  return {
    userId: user?.id,
    libraryUser,
    tracks,
    ratedAllTracks,
    error: userError || libraryUserError || trackError,
  };
}

function useUserDataByShareId(
  shareId: string
): { user: PumpkinUser | null; error: Error | null } {
  const { data, error } = useApiCall(shareId, fetchUserByShareId);
  return { user: data, error };
}

function useLoggedInUser() {
  const { user, accessToken } = useContext(GlobalStateContext).spotify;
  const { setSpotifyState } = globalSetters;
  const arg = user ? null : accessToken; // nothing is fetched with a null argument
  const { data, error } = useApiCall(arg, fetchLoggedInUser);
  if (!user && data) {
    setSpotifyState({ user: data });
  }
  return { user, error };
}

function useTrackPagination(shareId: string, trackIndex: number) {
  const [error, setError] = useState(null);
  const [tracks, setTracks] = useState<Record<number, PumpkinTrack>>({});
  const [fetchedAllTracks, setFetchedAllTracks] = useState(false);
  const [fetchingTracks, setFetchingTracks] = useState(false);

  const availableIndecies = Object.keys(tracks);
  const lastAvailableIndex =
    availableIndecies.length > 0
      ? Math.max(...availableIndecies.map((k) => parseInt(k, 10)))
      : -1;

  useEffect(() => {
    (async () => {
      if (
        !fetchedAllTracks &&
        !fetchingTracks &&
        lastAvailableIndex - trackIndex <= 2
      ) {
        try {
          setFetchingTracks(true);
          const fetchIndex = lastAvailableIndex + 1;
          const newTracks = await fetchTracks(shareId, fetchIndex, 3);
          if (!newTracks) return;

          if (newTracks.length === 0) {
            setFetchedAllTracks(true);
            return;
          }
          const newTracksRecord: Record<number, PumpkinTrack> = {};
          newTracks.forEach((t: PumpkinTrack, i: number) => {
            newTracksRecord[fetchIndex + i] = t;
          });
          const updatedTracks: Record<number, PumpkinTrack> = {
            ...tracks,
            ...newTracksRecord,
          };
          setTracks(updatedTracks);
          setFetchingTracks(false);
        } catch (e) {
          setError(e);
        }
      }
    })();
  }, [
    shareId,
    trackIndex,
    tracks,
    fetchingTracks,
    fetchedAllTracks,
    lastAvailableIndex,
  ]);
  const ratedAllTracks = fetchedAllTracks && trackIndex > lastAvailableIndex;
  return { tracks, ratedAllTracks, error };
}
