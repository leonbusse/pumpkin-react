import { delay } from "../util";
import { SpotifyUser, UnauthorizedError } from "./pumpkin";

const SPOTIFY_CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const SPOTIFY_REDIRECT_URI = `${process.env.REACT_APP_BASE_URL}spotify/callback`;
const spotifyScopes = [
  "user-read-private",
  "playlist-read-private",
  "user-read-email",
  "user-library-read",
  "playlist-modify-private",
];

function getSpotifyLoginUrl(destination?: string | undefined) {
  const redirectUrl = SPOTIFY_REDIRECT_URI;
  const state = destination;
  const url = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${redirectUrl}&scope=${encodeURIComponent(
    spotifyScopes.join(" ")
  )}${state ? `&state=${state}` : ""}`;
  console.log(url);
  return url;
}

export async function redirectOnUnauthorized<T>(
  block: () => T,
  destination?: string
): Promise<T | null> {
  try {
    return await block();
  } catch (e) {
    console.error("caught API error");
    if (e instanceof UnauthorizedError) {
      console.error("caught 401");
      const d = destination || window.location.pathname;
      await delay(3000);
      window.location.href = getSpotifyLoginUrl(d);
    } else {
      console.error(e);
      await delay(3000);
      throw e;
    }
    return null;
  }
}

async function fetchLoggedInUser(
  accessToken: string
): Promise<SpotifyUser | null> {
  console.log("fetch logged in Spotify user...");
  return redirectOnUnauthorized(async () => {
    const url = "https://api.spotify.com/v1/me";

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    console.log("logged in Spotify user response: ", data);
    if (data.error) {
      throw Error(JSON.stringify(data.error));
    }
    return data;
  });
}

export { getSpotifyLoginUrl, fetchLoggedInUser };
