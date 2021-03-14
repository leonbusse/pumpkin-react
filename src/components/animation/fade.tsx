import { FC } from "react";
import { animated, useTransition } from "react-spring";

export const FadeOut: FC<{ disabled?: boolean }> = (props) => {
  return (
    <Fade type="out" disabled={props.disabled}>
      {props.children}
    </Fade>
  );
};

export const FadeIn: FC<{
  disabled?: boolean;
  tension?: number;
  friction?: number;
}> = (props) => {
  return (
    <Fade
      type="in"
      disabled={props.disabled}
      tension={props.tension}
      friction={props.friction}
    >
      {props.children}
    </Fade>
  );
};

export const Fade: FC<{
  disabled?: boolean;
  type: "in" | "out";
  tension?: number;
  friction?: number;
}> = (props) => {
  const { type, tension, friction } = props;
  return (
    <>
      {useTransition(0, (i) => i, {
        from: {
          opacity: props.disabled
            ? type === "in"
              ? 1
              : 0
            : type === "in"
            ? 0
            : 1,
        },
        enter: { opacity: type === "in" ? 1 : 0 },
        leave: { opacity: type === "in" ? 1 : 0 },
        config: { tension: tension || 1000, friction: friction || 120 },
      }).map(({ item, props: animProps, key }) => (
        <animated.div key={key} style={{ ...animProps }}>
          {props.children}
        </animated.div>
      ))}
    </>
  );
};

export function useFadeAndFlyIn(items: any[]) {
  return useTransition(items, (i) => i.key, {
    from: { opacity: 0, transform: `translate3d(0,200px,0)` },
    enter: { opacity: 1, transform: `translate3d(0,0,0)` },
    leave: { opacity: 1, transform: `translate3d(0,0,0)` },
    config: {
      mass: 2,
      tension: 60,
      friction: 25,
      clamp: true,
    },
    trail: 200,
  });
}
