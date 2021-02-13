import React, { FC, useEffect, useState, useRef, useContext, useCallback } from "react";
import { Redirect, useParams } from "react-router-dom";
import { Box, Flex, Heading, ListItem, Spacer, Text, UnorderedList, useTheme } from "@chakra-ui/react";
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
import { globalSetters, GlobalStateContext } from "../../state";
import { CustomDialog, StaticDialog } from "react-st-modal";
import { CreatePlaylistDialogContent } from "../../components/CreatePlaylistDialog";
import { fetchLoggedInUser } from "../../api/spotify";
import { LoginRedirect } from "../../components/LoginRedirect";
import { useApiCall } from "../../util";
import { MobileScreen, ShareBottomBar } from "../../components/ShareBottomBar";
import { Button } from "../../components/Button";
import { DeleteButton } from "../../components/buttons";

interface SharePagePathParams {
  id: string;
}

export const SharePage: FC = () => {
  const { id: shareId } = useParams<SharePagePathParams>();
  const globalState = useContext(GlobalStateContext);
  const spotifyAccessToken = globalState.spotify.accessToken;

  const [trackIndex, setTrackIndex] = useState<number>(0);
  const [playing, setPlayling] = useState(false);
  const [done, setDone] = useState(false);
  const audioPlayer = useRef<HTMLAudioElement>(null);
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


  /** 
   * effects
   */

  useEffect(() => {
    if (audioPlayer && audioPlayer.current) {
      if (playing) {
        audioPlayer.current.play();
      } else {
        audioPlayer.current.pause();
      }
    }
  }, [trackIndex, playing]);


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

  const togglePlayback = () => {
    if (audioPlayer && audioPlayer.current) {
      if (audioPlayer.current.paused) {
        setPlayling(true);
      } else {
        setPlayling(false);
      }
    }
  };

  function likeTrack(libraryUserId: string, track: PumpkinTrack) {
    const likes = globalState.pumpkin.likes;
    const previousLikes = likes[libraryUserId]?.filter(t => t.id !== track.id) || [];
    const newLikes = { ...likes, [libraryUserId]: [...previousLikes, track] };
    console.log("updated likes:", newLikes);
    globalSetters.setPumpkinState({
      likes: newLikes,
    });
  }

  function removeLikedTracks(libraryUserId: string, tracks: PumpkinTrack[]) {
    const likes = globalState.pumpkin.likes;
    const previousLikes = likes[libraryUserId] || [];
    const newLikes = { ...likes, [libraryUserId]: previousLikes.filter(t => !tracks.includes(t)) };
    console.log("updated likes:", newLikes);
    globalSetters.setPumpkinState({
      likes: newLikes,
    });
  }

  const onDelete = (tracks: PumpkinTrack[]) => removeLikedTracks(shareId, tracks);

  const onCreatePlaylist = async (playlistName: string) => {
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


  /** 
   * early returns 
   */

  if (window.location.search.includes("action=createPlaylist")) {
    console.log("window.location.search:", window.location.search)
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
              maxHeight="calc(100vh - 5em)">
              {activeMobileScreen === MobileScreen.Listen ?
                <ListenScreen
                  libraryUser={libraryUser}
                  currentTrack={currentTrack}
                  onSwipe={onSwipe}
                  onCardLeftScreen={onCardLeftScreen}
                  nextTrack={nextTrack}
                /> :
                <OverviewScreen
                  onDone={onButtonDone}
                  onDelete={onDelete}
                  likes={globalState.pumpkin.likes[shareId]} />}
            </Box>
            <audio
              src={currentTrack.previewUrl as string}
              ref={audioPlayer}
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

interface ListenScreenProps {
  libraryUser: PumpkinUser;
  currentTrack: PumpkinTrack;
  onSwipe: (direction: string) => void;
  onCardLeftScreen: (myIdentifier: string) => Promise<void>;
  nextTrack: PumpkinTrack;
}

const ListenScreen: FC<ListenScreenProps> = (props) => {
  const { libraryUser, currentTrack, onSwipe, onCardLeftScreen, nextTrack } = props;
  const theme = useTheme();

  return (
    <Flex
      flexDirection="column"
      justifyContent="start"
      alignItems="center"
      width="100%"
      height="100%"
      padding="2em 0 3em 0"
    >
      <Heading as="a"
        href="/"
        width="100%"
        textAlign="center"
        size="2xl">
        ListenUp
        </Heading>
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
      </Flex>
      <Spacer />
    </Flex>
  );
}


interface OverviewScreenProps {
  likes: PumpkinTrack[];
  onDone: () => void;
  onDelete: (tracks: PumpkinTrack[]) => void;
}

const OverviewScreen: FC<OverviewScreenProps> = (props) => {
  const { likes, onDone, onDelete } = props;

  const [selected, setSelected] = useState<PumpkinTrack[]>([]);
  const onSelect = useCallback(
    (track: PumpkinTrack) => {
      if (selected.includes(track)) {
        setSelected(selected.filter(t => t !== track));
      }
      else {
        setSelected([...selected, track]);
      }
    },
    [selected]
  );

  const onDeleteButton = useCallback(() => {
    console.log("onDelete " + selected.map(t => t.name).join(", "));
    onDelete(selected);
    setSelected([]);
  }, [selected, onDelete]);

  return (
    <Flex
      as="section"
      flexDirection="column"
      justifyContent="start"
      alignItems="center"
      width="100%"
      height="100%"
      padding="2em 0 3em 0">

      <Heading size="2xl" >Liked Tracks</Heading>
      <TrackList likes={likes} onSelect={onSelect} selected={selected} />
      <Box flex="1" />
      <Box
        height="1em"
        _before={{
          content: '""',
          position: "relative",
          bottom: "6em",
          zIndex: "100",
          display: "inline-block",
          height: "6em",
          pointerEvents: "none",
          background: "linear-gradient(to bottom, rgba(0,255,255,0), rgba(255,255,255,1))",
          width: "100vw"
        }} />
      <Flex flexDirection="row">
        <Box width="4em" />
        <Button disabled={!likes || likes.length === 0} onClick={onDone}>Add to my Spotify</Button>
        <Box width="1em" />
        <DeleteButton
          opacity={selected.length > 0 ? "1" : "0"}
          onClick={onDeleteButton}
        />
      </Flex>
    </Flex>
  );
}

interface TrackListProps {
  likes: PumpkinTrack[];
  selected: PumpkinTrack[];
  onSelect: (track: PumpkinTrack) => void
}

const TrackList: FC<TrackListProps> = (props) => {
  const { likes, selected, onSelect } = props;
  const theme = useTheme();
  return <Box
    width="100%"
    padding="0 1em"
    overflowY="scroll">
    <UnorderedList
      margin="0"
      textAlign="center"
      padding="2em 0">
      {likes && likes.length > 0 ? [...likes, null].map((track) =>
        track === null ?
          <Box height="2em" key="spacer" />
          : <ListItem
            listStyleType="none"
            maxWidth={{ base: "70vw", md: "32em" }}
            margin="0 auto"
            cursor="pointer"
            onClick={() => onSelect(track)}
            key={track.id}>
            <Text
              fontSize={{ base: "1.15em", md: "1.5em" }}
              color={selected.includes(track) ? theme.colors.accent : theme.colors.primary}
              isTruncated>
              {track.name}
            </Text>
            <Text
              fontSize={{ base: "1em", md: "1.25em" }}
              color={selected.includes(track) ? theme.colors.accent : theme.colors.primary}
              fontWeight="700"
              isTruncated>
              {track.artists.join(", ")}
            </Text>
            <Box height="1em" />
          </ListItem>)
        : <Text padding="2em">You have not liked a song yet.<br />Go listen to some music!</Text>}
    </UnorderedList>
  </Box>
}

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
