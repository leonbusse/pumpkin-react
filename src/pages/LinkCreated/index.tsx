import React, { useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import { GlobalStateContext } from "../../state";

function LinkCreatedPage() {
  const shareLink = useContext(GlobalStateContext).pumpkin.shareLink;

  if (!shareLink) {
    console.error("no shareLink available");
    return (
      <>
        <Redirect to="/" />
      </>
    );
  }

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
  };

  return (
    <div className="App__container">
      <header>
        <h1>Pumpkin</h1>
        <h2>Your link has been created</h2>
      </header>
      <section>
        <p>{shareLink}</p>
        <button onClick={copyLink}>Copy to clipboard</button>
        <br />
        <br />
        <Link to="/">Back</Link>
      </section>
    </div>
  );
}

export { LinkCreatedPage };
