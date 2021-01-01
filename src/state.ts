import React from "react";

interface GlobalState {
  spotify: SpotifyState;
  setSpotifyState: (s: Partial<SpotifyState>) => void;
  pumpkin: PumpkinState;
  setPumpkinState: (s: Partial<PumpkinState>) => void;
}

interface SpotifyState {
  accessToken: string | null;
}

interface PumpkinState {
  shareLink: string | null;
}

const globalState: GlobalState = {
  spotify: {
    accessToken: null,
  },
  setSpotifyState: (s: any) => {
    globalState.spotify = { ...globalState, ...s };
  },
  pumpkin: {
    shareLink: null,
  },
  setPumpkinState: (s: any) => {
    globalState.pumpkin = { ...globalState, ...s };
  },
};
const GlobalStateContext = React.createContext(globalState);

export { globalState, GlobalStateContext };
export type { GlobalState, SpotifyState };
