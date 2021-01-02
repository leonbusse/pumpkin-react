import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import { globalState, GlobalStateContext } from "./state";
import { LandingPage } from "./pages/Landing";
import { SharePage } from "./pages/Share";
import { CreateLinkPage } from "./pages/CreateLink";
import { LinkCreatedPage } from "./pages/LinkCreated";
import { SpotifyCallbackHandler } from "./pages/SpotifyCallbackHandler";

function App() {
  return (
    <GlobalStateContext.Provider value={globalState}>
      <Routing />
    </GlobalStateContext.Provider>
  );
}

function Routing() {
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
        <Route path="/spotify/callback">
          <SpotifyCallbackHandler />
        </Route>
        <Route path="/">
          <LandingPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
