import React from "react";
import { SpotifyUser } from "./api/pumpkin";

interface SpotifyState {
  accessToken: string | null;
  user: SpotifyUser | null;
}

interface PumpkinState {
  shareLink: string | null;
}

function loadState() {
  const spotifyAccessToken = localStorage.getItem("spotifyAccessToken") || null;
  const spotifyUserString = localStorage.getItem("spotifyUser");
  const spotifyUser = spotifyUserString && JSON.parse(spotifyUserString);

  return {
    spotify: {
      accessToken: spotifyAccessToken,
      user: spotifyUser,
    } as SpotifyState,
    pumpkin: { shareLink: null } as PumpkinState,
  };
}

const globalState = loadState();
type GlobalState = typeof globalState;

const GlobalStateContext = React.createContext(globalState);

const globalSetters = {
  setSpotifyState: (s: Partial<SpotifyState>, save?: boolean) => {
    globalState.spotify = { ...globalState.spotify, ...s };
    if (save !== false) {
      localStorage.setItem(
        "spotifyAccessToken",
        globalState.spotify.accessToken || ""
      );
      localStorage.setItem(
        "spotifyUser",
        JSON.stringify(globalState.spotify.user)
      );
    }
  },
  setPumpkinState: (s: Partial<PumpkinState>) => {
    globalState.pumpkin = { ...globalState.pumpkin, ...s };
  },
};
type GlobalSetters = typeof globalSetters;

function saveState(state: GlobalState) {
  if (state.spotify.accessToken) {
    localStorage.setItem("spotifyAccessToken", state.spotify.accessToken);
  }
  if (state.spotify.user) {
    localStorage.setItem("spotifyUser", JSON.stringify(state.spotify.user));
  }
}

export { globalState, globalSetters, GlobalStateContext, saveState, loadState };
export type { GlobalState, SpotifyState, PumpkinState, GlobalSetters };
