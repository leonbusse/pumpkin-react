import React, {
  Component,
  FC,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { Link, useParams } from "react-router-dom";
import {
  fetchTracks,
  fetchUser,
  SpotifyTrack,
  SpotifyUser,
} from "../../api/pumpkin";

interface SharePagePathParams {
  id: string;
}

function SharePage() {
  const { id } = useParams<SharePagePathParams>();
  const [tracks, setTracks] = useState<SpotifyTrack[] | null>(null);
  useEffect(() => {
    (async () => {
      const tracks = await fetchTracks(id, 0, 100);
      setTracks(tracks);
    })();
  }, [id]);
  const [user, setUser] = useState<SpotifyUser | null>(null);
  useEffect(() => {
    (async () => {
      const user = await fetchUser(id);
      setUser(user);
    })();
  }, [id]);

  return (
    <div className="App__container">
      <header>
        <h1>Pumpkin</h1>
      </header>
      <section>
        <Loading
          predicate={() => tracks !== null && user !== null}
          placeholder={() => <p>loading...</p>}
        >
          <h2>This is {user?.display_name}'s library</h2>
          <ul>
            {(tracks || []).map((t) => (
              <li>
                <a href={t.preview_url || ""}>{t.name}</a>
              </li>
            ))}
          </ul>
        </Loading>
        <Link to="/">Back</Link>
      </section>
    </div>
  );
}

interface LoadingProps {
  predicate: () => boolean;
  placeholder?: FC;
}
const Loading: FC<PropsWithChildren<LoadingProps>> = (
  props: PropsWithChildren<LoadingProps>
) => {
  return props.predicate() ? (
    <>{props.children} </>
  ) : (
    (props.placeholder && <props.placeholder />) || <p>Loading...</p>
  );
};

export { SharePage };
