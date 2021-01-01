const SPOTIFY_CLIENT_ID = "4d80a6a7e1ba41b0b3f7d2305f6f9258";
const SPOTIFY_REDIRECT_URI = "http://localhost:3000/spotify/callback";
const SPOTIFY_SCOPE =
  "user-read-private playlist-read-private user-read-email user-library-read playlist-modify-private";

function getSpotifyLoginUrl() {
  return `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${SPOTIFY_REDIRECT_URI}&scope=${SPOTIFY_SCOPE}`;
}

export { getSpotifyLoginUrl };
