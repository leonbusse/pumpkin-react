import React, { FC, MutableRefObject, useCallback, useEffect } from "react";
import { PumpkinTrack } from "../../api/pumpkin";
import { SwipeCard } from "../SwipeCard";

import { animated, interpolate, useSpring } from "react-spring";
import { useGesture } from "react-use-gesture";

const SwipeConstants = {
  swipeTargetX: 200 + window.innerWidth,
  activeScale: 1.05,
  activeRotation: 10,
  defaultFriction: 50,
  activeTension: 800,
  goneTension: 200,
  defaultTension: 500,
};

interface SongSwiperProps {
  track: PumpkinTrack;
  onSwipe: (direction: string) => void;
  onCardLeftScreen: (myIdentifier: string) => void;
  swiperRef: MutableRefObject<any>;
}

export const SongSwiper: FC<SongSwiperProps> = (props) => {
  const { onSwipe, onCardLeftScreen, track, swiperRef } = props;

  const onGone = useCallback(
    (dir: number) => {
      onSwipe(dir === -1 ? "left" : "right");
      setTimeout(() => {
        onCardLeftScreen(track.id);
      }, 500);
    },
    [onCardLeftScreen, onSwipe, track.id]
  );

  const { bind, x, scale, rot, swipe } = useSwipe(onGone);

  useSwiperRefAssignment(swiperRef, swipe);

  return (
    <animated.div
      {...bind()}
      style={{
        touchAction: "none",
        transform: interpolate(
          // @ts-ignore
          [x, scale, rot],
          (x, s, r) => `translate3d(${x}px,0,0) scale(${s}) rotate(${r}deg)`
        ),
      }}
    >
      <SwipeCard track={track} />
    </animated.div>
  );
};

function useSwipe(onGone: (dir: number) => void) {
  const [{ x, scale, rot }, set] = useSpring(() => ({
    x: 0,
    scale: 1,
    rot: 0,
  }));
  const bind = useGesture({
    onDrag: ({
      down,
      direction: [xDir],
      velocity,
      movement: [xOffset, yOffset],
    }) => {
      const {
        swipeTargetX,
        activeScale,
        activeRotation,
        defaultFriction,
        activeTension,
        goneTension,
        defaultTension,
      } = SwipeConstants;
      const trigger =
        velocity > 0.2 && Math.abs(xOffset) > 2 * Math.abs(yOffset);
      const isGone = !down && trigger;
      const dir = xDir < 0 ? -1 : 1;
      const targetX = isGone ? swipeTargetX * dir : down ? xOffset : 0;
      const rot =
        (down && xOffset * dir > 100) || isGone ? activeRotation * dir : 0;
      const scale = down ? activeScale : 1;
      set({
        x: targetX,
        scale,
        rot,
        config: {
          friction: defaultFriction,
          tension: down ? activeTension : isGone ? goneTension : defaultTension,
        },
      });
      if (isGone) {
        onGone(dir);
      }
    },
  });

  const swipe = (dir: number) => {
    const {
      swipeTargetX,
      activeScale,
      activeRotation,
      defaultFriction,
      goneTension,
    } = SwipeConstants;
    set({
      x: swipeTargetX * dir,
      scale: activeScale,
      rot: activeRotation * dir,
      config: { friction: defaultFriction, tension: goneTension },
    });
    onGone(dir);
  };
  return { bind, x, scale, rot, swipe };
}

function useSwiperRefAssignment(
  swiperRef: MutableRefObject<any>,
  swipe: (dir: number) => void
) {
  useEffect(() => {
    const swiper = {
      swipe: (dir: string) => {
        swipe(dir === "left" ? -1 : 1);
      },
    };
    swiperRef.current = swiper;
  }, [swiperRef, swipe]);
}
