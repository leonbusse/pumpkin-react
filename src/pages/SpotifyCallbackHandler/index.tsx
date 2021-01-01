import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { GlobalStateContext, SpotifyState } from "../../state";

function SpotifyCallbackHandler() {
  const setSpotifyState = useContext(GlobalStateContext).setSpotifyState;
  const spotifyState: SpotifyState = useContext(GlobalStateContext).spotify;
  const spotifyAccessToken = window.location.hash.split("access_token=")[1];
  if (spotifyAccessToken) {
    setSpotifyState({ accessToken: spotifyAccessToken });
    return <Redirect to="/create-link" />;
  }
  if (!spotifyState.accessToken) {
    console.error("no spotify token in url or state!");
    return <Redirect to="/" />;
  }
  return <Redirect to="/create-link" />;
}

export { SpotifyCallbackHandler };
