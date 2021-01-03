import { SpotifyUser } from "./pumpkin";

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
  )}&state=${state}`;
  console.log(url);
  return url;
}

async function fetchLoggedInUser(accessToken: string): Promise<SpotifyUser> {
  console.log("fetch Spotify user...");
  const url = "https://api.spotify.com/v1/me";

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  console.log("response: ", data);
  if (data.error) {
    throw Error(JSON.stringify(data.error));
  }
  return data;
}

export { getSpotifyLoginUrl, fetchLoggedInUser };
