import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { createShareLink } from "../../api/pumpkin";
import { GlobalStateContext, SpotifyState } from "../../state";

function CreateLinkPage() {
  const globalState = useContext(GlobalStateContext);
  const spotifyState: SpotifyState = globalState.spotify;
  const setPumpkinState = globalState.setPumpkinState;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function a() {
      if (spotifyState.accessToken) {
        const shareLink = await createShareLink(spotifyState.accessToken);
        setPumpkinState({ shareLink: shareLink });
        setLoading(false);
      }
    }
    a();
  }, []);

  if (!spotifyState.accessToken) {
    console.error("no Spotify accessToken available");
    return (
      <>
        <Redirect to="/" />
      </>
    );
  }

  if (!loading) {
    return <Redirect to="/link-created" />;
  }
  return (
    <div className="App__container">
      <header>
        <h1>Pumpkin</h1>
        <h2>Your link is being generated...</h2>
      </header>
    </div>
  );
}

export { CreateLinkPage };
