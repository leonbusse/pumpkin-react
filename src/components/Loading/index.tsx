import { FC, PropsWithChildren } from "react";

interface LoadingProps {
  predicate: () => boolean;
  placeholder?: FC;
}
const Loading: FC<PropsWithChildren<LoadingProps>> = (
  props: PropsWithChildren<LoadingProps>
) => {
  return props.predicate() ? (
    <>{props.children} </>
  ) : (
    (props.placeholder && <props.placeholder />) || <p>Loading...</p>
  );
};

export { Loading };
