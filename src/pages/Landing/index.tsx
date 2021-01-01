import React, { useContext } from "react";
import { getSpotifyLoginUrl } from "../../api/spotify";
import { GlobalStateContext } from "../../state";

function LandingPage() {
  const spotifyState = useContext(GlobalStateContext).spotify;

  return (
    <div className="LandingPage__container">
      <header>
        <h1>Pumpkin</h1>
        <h2>Share your Spotify library with friends.</h2>
      </header>
      <section>
        <p>
          <a
            href={
              spotifyState.accessToken ? "/create-link" : getSpotifyLoginUrl()
            }
          >
            Generate
          </a>
          {" your link to get started."}
        </p>
      </section>
    </div>
  );
}

export { LandingPage };
