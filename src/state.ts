import React from "react";
import { PumpkinTrack, PumpkinUser } from "./api/pumpkin";

export interface SpotifyState {
  accessToken: string | null;
  user: PumpkinUser | null;
}

export interface PumpkinState {
  redirect: { href: string | null; destination: string | null };
  shareLink: string | null;
  likes: Record<string, PumpkinTrack[]>; // libraryUserId - tracks
}

const initialState = {
  spotify: {
    accessToken: null,
    user: null,
  } as SpotifyState,
  pumpkin: { redirect: {}, shareLink: null, likes: {} } as PumpkinState,
};

export type GlobalState = typeof initialState;

export function loadState() {
  const spotifyAccessToken = localStorage.getItem("spotifyAccessToken") || null;
  const spotifyUserString = localStorage.getItem("spotifyUser");
  const spotifyUser = spotifyUserString && JSON.parse(spotifyUserString);
  const likesString = localStorage.getItem("likes");
  const likes = (likesString && JSON.parse(likesString)) || [];

  return {
    spotify: {
      ...initialState.spotify,
      accessToken: spotifyAccessToken,
      user: spotifyUser,
    } as SpotifyState,
    pumpkin: { ...initialState.pumpkin, likes: likes } as PumpkinState,
  };
}

export const globalState = loadState();

export const GlobalStateContext = React.createContext(globalState);

export const globalSetters = {
  setSpotifyState: (s: Partial<SpotifyState>) => {
    globalState.spotify = { ...globalState.spotify, ...s };

    localStorage.setItem(
      "spotifyAccessToken",
      globalState.spotify.accessToken || ""
    );
    localStorage.setItem(
      "spotifyUser",
      JSON.stringify(globalState.spotify.user)
    );
    // console.log("setSpotifyState");
    document.dispatchEvent(new Event("StateUpdate"));
  },
  setPumpkinState: (s: Partial<PumpkinState>) => {
    globalState.pumpkin = { ...globalState.pumpkin, ...s };

    localStorage.setItem("likes", JSON.stringify(globalState.pumpkin.likes));
    // console.log("setPumpkinState");
    document.dispatchEvent(new Event("StateUpdate"));
  },
};

export type GlobalSetters = typeof globalSetters;
