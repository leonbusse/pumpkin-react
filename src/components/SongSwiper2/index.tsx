import React, { FC, RefObject } from "react";
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

    const [{ x, scale }, set] = useSpring(() => ({ x: 0, scale: 1, from: { x: 0, scale: 1 } }))
    const bind = useGesture({
        onDrag: ({ down, direction: [xDir], velocity, movement: [xOffset] }) => {
            console.log("onDrag, ", xOffset);
            const trigger = velocity > 0.2 && Math.abs(xOffset) > 50;
            const isGone = !down && trigger;
            const dir = xDir < 0 ? -1 : 1;
            const targetX = isGone ? (200 + window.innerWidth) * dir : down ? xOffset : 0;
            const scale = down ? 1.1 : 1;
            set({ x: targetX, scale, config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 } });
            if (isGone) {
                onSwipe(dir === -1 ? "left" : "right");
                setTimeout(() => {
                    onCardLeftScreen(track.id);
                }, 500);
            }
        },
        onPointerDown: ({ event, ...sharedState }) => console.log('pointer down', event),
    })
    return <animated.div
        {...bind()}
        // @ts-ignore
        style={{ touchAction: "none", transform: interpolate([x, scale], (x, s) => `translate3d(${x}px,0,0) scale(${s})`) }}
    >
        <SwipeCard track={track} />
    </animated.div>
};
