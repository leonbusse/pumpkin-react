import React from "react";
import { SpotifyUser } from "./api/pumpkin";

interface GlobalState {
  spotify: SpotifyState;
  setSpotifyState: (s: Partial<SpotifyState>) => void;
  pumpkin: PumpkinState;
  setPumpkinState: (s: Partial<PumpkinState>) => void;
}

interface SpotifyState {
  accessToken: string | null;
  user: SpotifyUser | null;
}

interface PumpkinState {
  shareLink: string | null;
}

const globalState: GlobalState = {
  spotify: {
    accessToken: null,
    user: null,
  },
  setSpotifyState: (s: any) => {
    globalState.spotify = { ...globalState.spotify, ...s };
    // console.log(
    //   `updated spotify state: ` + JSON.stringify(globalState.spotify)
    // );
  },
  pumpkin: {
    shareLink: null,
  },
  setPumpkinState: (s: any) => {
    globalState.pumpkin = { ...globalState.pumpkin, ...s };
  },
};
const GlobalStateContext = React.createContext(globalState);

export { globalState, GlobalStateContext };
export type { GlobalState, SpotifyState };
