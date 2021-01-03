import React, { FC, useEffect, useState, useRef, useContext } from "react";
import { Link, Redirect, useParams } from "react-router-dom";
import {
  fetchTracks,
  fetchUser,
  likeTrack,
  SpotifyTrack,
  SpotifyUser,
  createPlaylist,
} from "../../api/pumpkin";
import { Loading } from "../../components/Loading";
import { SwipeCard } from "../../components/SwipeCard";
import { SongSwiper } from "../../components/SongSwiper";
import { PlayButton } from "../../components/PlayButton";
import { PlusButton } from "../../components/PlusButton";
import { GlobalStateContext } from "../../state";
import { CustomDialog, StaticDialog } from "react-st-modal";
import { CreatePlaylistDialogContent } from "../../components/CreatePlaylistDialog";
import { fetchLoggedInUser } from "../../api/spotify";

interface SharePagePathParams {
  id: string;
}

const SharePage: FC = () => {
  const { id: libraryUserId } = useParams<SharePagePathParams>();
  const spotifyAccessToken = useContext(GlobalStateContext).spotify.accessToken;

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
  } = useSharePageData(libraryUserId, trackIndex);

  const currentTrack = tracks && tracks[trackIndex];
  const nextTrack = tracks && tracks[trackIndex + 1];

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
    console.log("onSwipe: " + direction);
    if (direction === "right" && userId && libraryUserId && currentTrack) {
      likeTrack(userId, libraryUserId, currentTrack.id);
    } else {
      console.log("onSwipe: ", userId, libraryUserId, currentTrack);
    }
  };

  const onCardLeftScreen = async (myIdentifier: string) => {
    console.log("onCardLeftScreen: " + myIdentifier);
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

  const onCreatePlaylist = (playlistName: string) => {
    if (spotifyAccessToken && userId) {
      console.log("onCreatePlaylist");
      createPlaylist(userId, libraryUserId, playlistName, spotifyAccessToken);
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
    return (
      <Redirect
        to={`/login?destination=${encodeURIComponent(
          window.location.pathname
        )}`}
      />
    );
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

  console.log("render: ", userId, libraryUserId, currentTrack);
  return (
    <div className="App__container">
      <header>
        <h1>Pumpkin</h1>
      </header>
      <Loading
        condition={() =>
          currentTrack && userId && libraryUser && libraryUserId ? true : false
        }
        placeholder={() => <p>Loading...</p>}
        error={() => error}
      >
        {currentTrack && userId && libraryUser && libraryUserId && (
          <>
            <section className="SharePage__swipe-container">
              <h2>This is {libraryUser.display_name}'s library</h2>
              <div className="SharePage__swipe-cards-wrapper">
                <SongSwiper
                  track={currentTrack}
                  onSwipe={onSwipe}
                  onCardLeftScreen={onCardLeftScreen}
                />
                {nextTrack && (
                  <div className="SharePage__card-preview">
                    <SwipeCard track={nextTrack} />
                  </div>
                )}
              </div>
              <audio
                src={currentTrack.preview_url as string}
                ref={audioPlayer}
                onEnded={() => setPlayling(false)}
              />
              <div style={{ display: "flex", flexDirection: "row" }}>
                <PlayButton onClick={togglePlayback} playing={playing} />
                <div style={{ width: 60 }} />
                <PlusButton onClick={onButtonDone} />
              </div>
            </section>
          </>
        )}
      </Loading>
      <br />
      <Link to="/">Back</Link>
    </div>
  );
};

function useSharePageData(libraryUserId: string, trackIndex: number) {
  const { user, error: userError } = useLoggedInUser();

  const { user: libraryUser, error: libraryUserError } = useUserData(
    libraryUserId
  );

  const { tracks, ratedAllTracks, error: trackError } = useTrackPagination(
    libraryUserId,
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

function useUserData(userId: string) {
  const [error, setError] = useState(null);
  const [user, setUser] = useState<SpotifyUser | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const user = await fetchUser(userId);
        setUser(user);
      } catch (e) {
        setError(e);
      }
    })();
  }, [userId]);

  return { user, error };
}

function useLoggedInUser() {
  const [error, setError] = useState<Error | null>(null);
  const [fetching, setFetching] = useState(false);
  const { user, accessToken } = useContext(GlobalStateContext).spotify;
  const setSpotifyState = useContext(GlobalStateContext).setSpotifyState;
  useEffect(() => {
    (async () => {
      if (!fetching && !user) {
        if (accessToken) {
          setFetching(true);
          const loggedInUser = await fetchLoggedInUser(accessToken);
          setSpotifyState({ user: loggedInUser });
          setError(null);
          setFetching(false);
        } else {
          setError(Error("no access token available to fetch user"));
        }
      }
    })();
  }, [user, accessToken, fetching, setSpotifyState]);
  return { user, error };
}

function useTrackPagination(libraryUserId: string, trackIndex: number) {
  const [error, setError] = useState(null);
  const [tracks, setTracks] = useState<Record<number, SpotifyTrack>>({});
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
          const newTracks = await fetchTracks(libraryUserId, fetchIndex, 3);
          if (newTracks.length === 0) {
            setFetchedAllTracks(true);
            return;
          }
          const newTracksRecord: Record<number, SpotifyTrack> = {};
          newTracks.forEach((t: SpotifyTrack, i: number) => {
            newTracksRecord[fetchIndex + i] = t;
          });
          const updatedTracks: Record<number, SpotifyTrack> = {
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
    libraryUserId,
    trackIndex,
    tracks,
    fetchingTracks,
    fetchedAllTracks,
    lastAvailableIndex,
  ]);
  const ratedAllTracks = fetchedAllTracks && trackIndex > lastAvailableIndex;
  return { tracks, ratedAllTracks, error };
}

export { SharePage };
