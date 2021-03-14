import { FC } from "react"
import { animated, useTransition } from "react-spring"


export const FadeOut: FC<{ disabled?: boolean }> = (props) => {
    return <>
        {useTransition(0, i => i, {
            from: { opacity: props.disabled ? 0 : 1 },
            enter: { opacity: 0 },
            leave: { opacity: 0 },
            config: { tension: 1000, friction: 120 },
        }).map(({ item, props: animProps, key }) => (
            <animated.div
                key={key}
                style={{ ...animProps }}>
                {props.children}
            </animated.div>
        ))}
    </>
}