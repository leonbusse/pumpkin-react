import React, { FC } from "react";
import { Redirect, RedirectProps, useLocation } from "react-router-dom";

interface PumpkinRedirectProps extends RedirectProps {
  destination?: string;
}

export const LoginRedirect: FC = () => {
  const location = useLocation();
  return <PumpkinRedirect to="/login" destination={location.pathname} />;
};

export const PumpkinRedirect: FC<PumpkinRedirectProps> = (props) => {
  const { destination, to } = props;
  const url = `${to}?destination=${encodeURIComponent(destination || "/")}`;
  console.log("PumpkinRedirect: redirecting to " + url);
  return <Redirect to={url} />;
};
