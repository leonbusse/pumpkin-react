const pumpkinEndpoint = process.env.REACT_APP_PUMPKIN_ENDPOINT;
const baseUrl = process.env.REACT_APP_BASE_URL;

async function ping() {
  console.log("ping...");
  return fetch(`${pumpkinEndpoint}api/v1/ping`)
    .then((response) => response.text())
    .then((data) => console.log("response: " + data));
}

async function createShareLink(spotifyAccessToken: string): Promise<string> {
  console.log("createShareLink...");
  const response = await fetch(`${pumpkinEndpoint}api/v1/import`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ spotifyAccessToken: spotifyAccessToken }),
  });
  const data = await response.json();
  console.log("response: ", data);
  if (data.error) {
    throw Error(JSON.stringify(data.error));
  }
  return baseUrl + `share/${data.shareId}`;
}

async function fetchTracks(
  userId: string,
  offset: number,
  limit: number
): Promise<SpotifyTrack[]> {
  console.log("fetchTracks...");
  const url = `${pumpkinEndpoint}api/v1/tracks/${userId}?offset=${offset}&limit=${limit}`;

  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  });
  const data = await response.json();
  console.log("response: ", data);
  return data;
}

async function fetchUser(userId: string): Promise<SpotifyUser> {
  console.log(`fetchUser ${userId}...`);
  const url = `${pumpkinEndpoint}api/v1/user/${userId}`;

  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  });
  const data = await response.json();
  console.log("response: ", data);
  if (data.error) {
    throw Error(JSON.stringify(data.error));
  }
  return data;
}

async function likeTrack(
  userId: string,
  libraryUserId: string,
  trackId: string
) {
  console.log("likeTrack " + trackId);
  const url = `${pumpkinEndpoint}api/v1/like`;

  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      userId: userId,
      libraryUserId: libraryUserId,
      trackIds: [trackId],
    }),
  });
  const data = await response.text();
  if (!response.ok) {
    throw Error(`server status code: ${response.status}`);
  }
  return data;
}

async function createPlaylist(
  userId: string,
  libraryUserId: string,
  playlistName: string,
  spotifyAccessToken: string
): Promise<string> {
  console.log("createPlaylist...");
  const response = await fetch(`${pumpkinEndpoint}api/v1/create-playlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      spotifyAccessToken: spotifyAccessToken,
      userId: userId,
      libraryUserId: libraryUserId,
      playlistName: playlistName,
    }),
  });
  const data = await response.json();
  console.log("response: ", data);
  if (data.error) {
    throw Error(JSON.stringify(data.error));
  }
  return data;
}

interface SpotifyTrack {
  id: string;
  name: string;
  preview_url: string | null;
  album: SpotifyAlbum;
  artist: SpotifyArtist | null;
}

interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  product: string;
}

interface SpotifyAlbum {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  images: SpotifyImage[];
}

interface SpotifyImage {
  url: string;
  hieght: number;
  width: number;
}

interface SpotifyArtist {
  id: string;
  name: string;
}

export {
  ping,
  createShareLink,
  fetchTracks,
  fetchUser,
  likeTrack,
  createPlaylist,
};
export type {
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyImage,
  SpotifyTrack,
  SpotifyUser,
};
