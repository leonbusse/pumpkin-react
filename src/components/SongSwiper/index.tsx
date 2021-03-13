import React, { FC, RefObject } from "react";
import TinderCard from "react-tinder-card";
import { PumpkinTrack } from "../../api/pumpkin";
import { SwipeCard } from "../SwipeCard";

interface SongSwiperProps {
  track: PumpkinTrack;
  onSwipe: (direction: string) => void;
  onCardLeftScreen: (myIdentifier: string) => void;
  swiperRef: RefObject<any>;
}
export const SongSwiper: FC<SongSwiperProps> = (props) => {
  const { onSwipe, onCardLeftScreen, track, swiperRef } = props;

  return (
    <TinderCard
      onSwipe={onSwipe}
      onCardLeftScreen={() => onCardLeftScreen(track.id)}
      key={track.id}
      ref={swiperRef}
    >
      <SwipeCard track={track} />
    </TinderCard>
  );
};
