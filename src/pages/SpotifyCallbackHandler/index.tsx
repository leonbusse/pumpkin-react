import { FC, useContext } from "react";
import { Redirect } from "react-router-dom";
import { fetchLoggedInUser } from "../../api/spotify";
import { globalSetters, GlobalStateContext, SpotifyState } from "../../state";

export const SpotifyCallbackHandler: FC = () => {
  console.log("handle Spotify login callback...");
  console.log("    url:  " + window.location.href);
  const { setSpotifyState } = globalSetters;
  const spotifyState: SpotifyState = useContext(GlobalStateContext).spotify;
  const spotifyAccessToken = window.location.hash
    .split("access_token=")[1]
    .split("&")[0];

  const hashParams = window.location.hash.split("#", 2)[1].split("&");
  const encodedDestination = hashParams
    .find((param) => param.startsWith("state"))
    ?.split("=")[1];
  let destination =
    encodedDestination && decodeURIComponent(encodedDestination);

  if (spotifyAccessToken) {
    fetchLoggedInUser(spotifyAccessToken).then((u) => {
      setSpotifyState({ user: u });
    });
    setSpotifyState({ accessToken: spotifyAccessToken });
    const d = destination || "/";
    console.log("received new access token, redirecting to " + d);
    return <Redirect to={d} />;
  }
  if (!spotifyState.accessToken) {
    console.error("no spotify token in url or state!");
    return <Redirect to="/" />;
  }
  return <Redirect to="/" />;
};
