import React from "react";
import { Link } from "react-router-dom";

function PlaylistCreatedPage() {
  return (
    <div className="App__container">
      <header>
        <h1>Pumpkin</h1>
        <h2>A playlist has been created in your Spotify library.</h2>
      </header>
      <section>
        <Link to="/">Back</Link>
      </section>
    </div>
  );
}

export { PlaylistCreatedPage };
