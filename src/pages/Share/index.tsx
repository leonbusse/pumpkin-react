import React, { FC, useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  fetchTracks,
  fetchUser,
  likeTrack,
  SpotifyTrack,
  SpotifyUser,
} from "../../api/pumpkin";
import { Loading } from "../../components/Loading";
import { SwipeCard } from "../../components/SwipeCard";
import { SongSwiper } from "../../components/SongSwiper";
import { PlayButton } from "../../components/PlayButton";

interface SharePagePathParams {
  id: string;
}

const SharePage: FC = () => {
  const { id } = useParams<SharePagePathParams>();
  const { tracks, user } = useSharePageData(id);

  const [trackIndex, setTrackIndex] = useState<number>(0);
  const [playing, setPlayling] = useState(false);
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
      user && tracks && likeTrack(user.id, user.id, tracks[trackIndex].id);
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

  return (
    <div className="App__container">
      <header>
        <h1>Pumpkin</h1>
      </header>
      <Loading
        predicate={() => tracks !== null && user !== null}
        placeholder={() => <p>loading...</p>}
      >
        {tracks && (
          <>
            <section className="SharePage__swipe-container">
              <h2>This is {user?.display_name}'s library</h2>
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
              <PlayButton onClick={togglePlayback} playing={playing} />
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
  useEffect(() => {
    (async () => {
      const tracks = await fetchTracks(id, 0, 100);
      setTracks(tracks);
    })();
  }, [id]);

  const [user, setUser] = useState<SpotifyUser | null>(null);
  useEffect(() => {
    (async () => {
      const user = await fetchUser(id);
      setUser(user);
    })();
  }, [id]);

  return { user, tracks };
}

export { SharePage };
