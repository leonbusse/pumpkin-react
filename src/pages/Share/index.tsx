import React, { FC, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  fetchTracks,
  fetchUser,
  likeTrack,
  SpotifyTrack,
  SpotifyUser,
} from "../../api/pumpkin";
import { Loading } from "../../components/Loading";
import TinderCard from "react-tinder-card";
import { SwipeCard } from "../../components/SwipeCard";

interface SharePagePathParams {
  id: string;
}

function SharePage() {
  const { id } = useParams<SharePagePathParams>();
  const [tracks, setTracks] = useState<SpotifyTrack[] | null>(null);
  const [trackIndex, setTrackIndex] = useState<number>(0);

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

  return (
    <div className="App__container">
      <header>
        <h1>Pumpkin</h1>
      </header>
      <section>
        <Loading
          predicate={() => tracks !== null && user !== null}
          placeholder={() => <p>loading...</p>}
        >
          {tracks && (
            <div className="SharePage__swipe-container">
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
            </div>
          )}
        </Loading>
        <br />
        <Link to="/">Back</Link>
      </section>
    </div>
  );
}

interface SongSwiperProps {
  track: SpotifyTrack;
  onSwipe: (direction: string) => void;
  onCardLeftScreen: (myIdentifier: string) => void;
}
const SongSwiper: FC<SongSwiperProps> = (props) => {
  const { onSwipe, onCardLeftScreen, track } = props;

  return (
    <>
      <TinderCard
        onSwipe={onSwipe}
        onCardLeftScreen={() => onCardLeftScreen(track.id)}
        preventSwipe={["up", "down"]}
        key={track.id}
      >
        <SwipeCard track={track} />
      </TinderCard>
    </>
  );
};

export { SharePage };
