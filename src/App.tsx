import React, { Component, FC, ReactNode, useContext } from "react";
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
import { animated, useTransition } from "react-spring";

const colors = {
  primary: "black",
  secondary: "white",
  accent: "#1DB954",
};
const theme = extendTheme({ colors });


class App extends Component {

  hasMounted = false;

  stateUpdateListener = (e: any) => {
    console.log("StateUpdate", e)
    if (this.hasMounted) {
      this.forceUpdate();
    }
  };

  componentDidMount() {
    this.hasMounted = true;
    document.addEventListener("StateUpdate", this.stateUpdateListener);
  }

  componentWillUnmount() {
    document.removeEventListener("StateUpdate", this.stateUpdateListener);
  }

  render() {
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
}


const Routing: FC = () => {

  const location = window.location;
  const transitions = useTransition(location, (location) => location.pathname, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    <Router>
      {transitions.map(({ item, props, key }) => (
        <animated.div key={key} style={props}>
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
        </animated.div>)
      )}
    </Router>
  );
};

export default App;
