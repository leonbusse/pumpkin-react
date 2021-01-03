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
import { CustomDialog } from "react-st-modal";
import { CreatePlaylistDialogContent } from "../../components/CreatePlaylistDialog";

interface SharePagePathParams {
  id: string;
}

const SharePage: FC = () => {
  const { id: libraryUserId } = useParams<SharePagePathParams>();
  const { tracks, user, error } = useSharePageData(libraryUserId);
  const spotifyAccessToken = useContext(GlobalStateContext).spotify.accessToken;
  const userId = useContext(GlobalStateContext).spotify.user?.id;

  const [trackIndex, setTrackIndex] = useState<number>(0);
  const [playing, setPlayling] = useState(false);
  const [done, setDone] = useState(false);
  const audioPlayer = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioPlayer && audioPlayer.current) {
      if (playing) {
        audioPlayer.current.play();
      }
    }
  }, [trackIndex]);

  const onSwipe = (direction: string) => {
    console.log("onSwipe: " + direction);
    if (direction === "right") {
      userId &&
        libraryUserId &&
        tracks &&
        likeTrack(userId, libraryUserId, tracks[trackIndex].id);
    }
  };

  const onCardLeftScreen = async (myIdentifier: string) => {
    console.log("onCardLeftScreen: " + myIdentifier);
    setTrackIndex(trackIndex + 1);
  };

  const togglePlayback = () => {
    if (audioPlayer && audioPlayer.current) {
      if (audioPlayer.current.paused) {
        audioPlayer.current.play();
        setPlayling(true);
      } else {
        audioPlayer.current.pause();
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

  const onButtonDone = async () => {
    const playlistName = await CustomDialog(<CreatePlaylistDialogContent />, {
      title: "Create Playlist",
      showCloseIcon: true,
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

  return (
    <div className="App__container">
      <header>
        <h1>Pumpkin</h1>
      </header>
      <Loading
        condition={() => tracks !== null && user !== null}
        placeholder={() => <p>Loading...</p>}
        error={() => error}
      >
        {user && tracks && (
          <>
            <section className="SharePage__swipe-container">
              <h2>This is {user.display_name}'s library</h2>
              <div className="SharePage__swipe-cards-wrapper">
                <SongSwiper
                  track={tracks[trackIndex]}
                  onSwipe={onSwipe}
                  onCardLeftScreen={onCardLeftScreen}
                />
                <div className="SharePage__card-preview">
                  <SwipeCard track={tracks[trackIndex + 1]} />
                </div>
              </div>
              <audio
                src={tracks[trackIndex].preview_url as string}
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

function useSharePageData(id: string) {
  const [tracks, setTracks] = useState<SpotifyTrack[] | null>(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const tracks = await fetchTracks(id, 0, 100);
        setTracks(tracks);
      } catch (e) {
        setError(e);
      }
    })();
  }, [id]);

  const [user, setUser] = useState<SpotifyUser | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const user = await fetchUser(id);
        setUser(user);
      } catch (e) {
        setError(e);
      }
    })();
  }, [id]);

  return { user, tracks, error };
}

export { SharePage };
