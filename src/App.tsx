import React, { FC } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { GlobalStateContext, globalState } from "./state";
import { LandingPage } from "./pages/Landing";
import { SharePage } from "./pages/Share";
import { CreateLinkPage } from "./pages/CreateLink";
import { LinkCreatedPage } from "./pages/LinkCreated";
import { SpotifyCallbackHandler } from "./pages/SpotifyCallbackHandler";
import { SpotifyLogin } from "./pages/SpotifyLogin";
import { PlaylistCreatedPage } from "./pages/PlaylistCreated";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { ErrorBoundary } from "./components/ErrorBoundary";

const colors = {
  colorAccent: "#1DB954",
};
const theme = extendTheme({ colors });

function App() {
  return (
    <ErrorBoundary>
      <GlobalStateContext.Provider value={globalState}>
        <ChakraProvider theme={theme} resetCSS>
          <Routing />
        </ChakraProvider>
      </GlobalStateContext.Provider>
    </ErrorBoundary>
  );
}

const Routing: FC = () => {
  return (
    <Router>
      <Switch>
        {/* <RedirectHandler /> */}
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
