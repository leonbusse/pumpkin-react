import { useContext } from "react";
import { Redirect } from "react-router-dom";
import { fetchLoggedInUser } from "../../api/spotify";
import { GlobalStateContext, SpotifyState } from "../../state";

function SpotifyCallbackHandler() {
  const setSpotifyState = useContext(GlobalStateContext).setSpotifyState;
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
  console.log("destination: " + destination);
  if (destination === "undefined") {
    destination = undefined;
  }

  if (spotifyAccessToken) {
    fetchLoggedInUser(spotifyAccessToken).then((u) => {
      setSpotifyState({ user: u });
    });
    setSpotifyState({ accessToken: spotifyAccessToken });
    return <Redirect to={destination || "/create-link"} />;
  }
  if (!spotifyState.accessToken) {
    console.error("no spotify token in url or state!");
    return <Redirect to="/" />;
  }
  return <Redirect to="/create-link" />;
}

export { SpotifyCallbackHandler };
