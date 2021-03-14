import React, { FC, RefObject, useCallback } from "react";
import { PumpkinTrack } from "../../api/pumpkin";
import { SwipeCard } from "../SwipeCard";

import { animated, interpolate, useSpring } from 'react-spring'
import { useGesture } from 'react-use-gesture'


interface SongSwiper2Props {
    track: PumpkinTrack;
    onSwipe: (direction: string) => void;
    onCardLeftScreen: (myIdentifier: string) => void;
    swiperRef: RefObject<any>;
}
export const SongSwiper2: FC<SongSwiper2Props> = (props) => {
    const { onSwipe, onCardLeftScreen, track } = props;

    const onGone = useCallback((dir: number) => {
        onSwipe(dir === -1 ? "left" : "right");
        setTimeout(() => {
            onCardLeftScreen(track.id);
        }, 500);
    }, [onCardLeftScreen, onSwipe, track.id]);

    const { bind, x, scale, rot } = useSwipe(onGone);


    return <animated.div
        {...bind()}
        style={{
            touchAction: "none",
            // @ts-ignore
            transform: interpolate([x, scale, rot], (x, s, r) => `translate3d(${x}px,0,0) scale(${s}) rotate(${r}deg)`)
        }}
    >
        <SwipeCard track={track} />
    </animated.div>
};


function useSwipe(onGone: (dir: number) => void) {

    const [{ x, scale, rot }, set] = useSpring(() => ({ x: 0, scale: 1, rot: 0 }))
    const bind = useGesture({
        onDrag: ({ down, direction: [xDir], velocity, movement: [xOffset] }) => {
            console.log("onDrag, ", xOffset);
            const trigger = velocity > 0.2 && Math.abs(xOffset) > 50;
            const isGone = !down && trigger;
            const dir = xDir < 0 ? -1 : 1;
            const targetX = isGone ? (200 + window.innerWidth) * dir : down ? xOffset : 0;
            const rot = (down && xOffset * dir > 100) || isGone ? 10 * dir : 0;
            const scale = down ? 1.1 : 1;
            set({ x: targetX, scale, rot, config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 } });
            if (isGone) {
                onGone(dir);
            }
        },
        onPointerDown: ({ event, ...sharedState }) => console.log('pointer down', event),
    })
    return { bind, x, scale, rot };
}