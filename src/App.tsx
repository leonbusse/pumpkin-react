import React, { FC } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { globalState, GlobalStateContext } from "./state";
import { LandingPage } from "./pages/Landing";
import { SharePage } from "./pages/Share";
import { CreateLinkPage } from "./pages/CreateLink";
import { LinkCreatedPage } from "./pages/LinkCreated";
import { SpotifyCallbackHandler } from "./pages/SpotifyCallbackHandler";
import { SpotifyLogin } from "./pages/SpotifyLogin";
import { PlaylistCreatedPage } from "./pages/PlaylistCreated";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";

const colors = {
  colorAccent: "#1DB954",
};
const theme = extendTheme({ colors });

function App() {
  return (
    <GlobalStateContext.Provider value={globalState}>
      <ChakraProvider theme={theme} resetCSS>
        <Routing />
      </ChakraProvider>
    </GlobalStateContext.Provider>
  );
}

const Routing: FC = () => {
  console.log("location.href: " + window.location.href);
  const splits = window.location.href.split("?", 2);
  console.log(splits);
  const destination = splits[1]
    ?.split("&")
    ?.find((param) => param.startsWith("destination"))
    ?.split("=")[1];
  console.log("destination: " + destination);

  return (
    <Router>
      <Switch>
        <Route path="/share/:id">
          <SharePage />
        </Route>
        <Route path="/create-link">
          <CreateLinkPage />
        </Route>
        <Route path="/link-created">
          <LinkCreatedPage />
        </Route>
        <Route path="/playlist-created">
          <PlaylistCreatedPage />
        </Route>
        <Route path="/login" component={SpotifyLogin}></Route>
        <Route path="/spotify/callback">
          <SpotifyCallbackHandler />
        </Route>
        <Route path="/">
          <LandingPage />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
