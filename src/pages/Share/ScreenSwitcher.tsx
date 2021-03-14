import { FC } from "react";
import { animated, useTransition } from "react-spring";

export const ScreenSwitcher: FC<{
  active: number;
}> = (props) => {
  const { active, children } = props;

  const transitions = useTransition(active, null, {
    from: {
      opacity: 0,
      transform: `translate3d(${active === 0 ? -400 : 400}px, 0, 0)`,
    },
    enter: {
      opacity: 1,
      transform: `translate3d(0vw, 0, 0)`,
    },
    leave: {
      opacity: 0,
      transform: `translate3d(${active === 0 ? 400 : -400}px, 0, 0)`,
    },
  });

  return (
    <>
      {transitions.map(({ item, key, props }) => (
        <ScreenTransitionContainer animProps={props} key={key}>
          {
            // @ts-ignore
            item === 0 ? children[0]!! : children[1]!!
          }
        </ScreenTransitionContainer>
      ))}
    </>
  );
};

const ScreenTransitionContainer: FC<{ animProps: any }> = (props) => {
  return (
    <animated.div
      style={{
        ...props.animProps,
        width: "100%",
        height: "100%",
        position: "absolute",
      }}
    >
      {props.children}
    </animated.div>
  );
};
