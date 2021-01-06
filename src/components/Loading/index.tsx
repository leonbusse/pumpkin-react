import React, { FC, PropsWithChildren } from "react";
import LoadingSpinner from "../LoadingSpinner";

interface LoadingProps {
  condition: () => boolean;
  placeholder?: FC;
  error?: () => Error | null;
  errorComponent?: FC;
}
const Loading: FC<PropsWithChildren<LoadingProps>> = (
  props: PropsWithChildren<LoadingProps>
) => {
  const {
    condition,
    placeholder: Placeholder,
    error,
    errorComponent: ErrorComponent,
    children,
  } = props;
  const e = error && error();
  if (e) {
    return ErrorComponent ? (
      <ErrorComponent />
    ) : (
      <>
        <p>An error occured.</p>
        <p>
          {process.env.NODE_ENV === "development"
            ? e.message
            : "Please try again later."}
        </p>
      </>
    );
  }
  return condition() ? (
    <>{children} </>
  ) : (
    (Placeholder && <Placeholder />) || <LoadingSpinner />
  );
};

export { Loading };
