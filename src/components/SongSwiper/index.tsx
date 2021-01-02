import React, { FC } from "react";
import TinderCard from "react-tinder-card";
import { SpotifyTrack } from "../../api/pumpkin";
import { SwipeCard } from "../SwipeCard";

interface SongSwiperProps {
  track: SpotifyTrack;
  onSwipe: (direction: string) => void;
  onCardLeftScreen: (myIdentifier: string) => void;
}
const SongSwiper: FC<SongSwiperProps> = (props) => {
  const { onSwipe, onCardLeftScreen, track } = props;

  return (
    <TinderCard
      onSwipe={onSwipe}
      onCardLeftScreen={() => onCardLeftScreen(track.id)}
      preventSwipe={["up", "down"]}
      key={track.id}
    >
      <SwipeCard track={track} />
    </TinderCard>
  );
};

export { SongSwiper };
