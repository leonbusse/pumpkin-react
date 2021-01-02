import { sleep } from "../util";

async function ping() {
  console.log("ping...");
  return fetch("http://localhost:8080/api/v1/ping")
    .then((response) => response.text())
    .then((data) => console.log("response: " + data));
}

async function createShareLink(spotifyAccessToken: string): Promise<string> {
  console.log("createShareLink...");
  const response = await fetch("http://localhost:8080/api/v1/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ spotifyAccessToken: spotifyAccessToken }),
  });
  const data = await response.json();
  console.log("response: ", data);
  return data.shareLink;
}

async function fetchTracks(
  userId: string,
  offset: number,
  limit: number
): Promise<SpotifyTrack[]> {
  console.log("fetchTracks...");
  const url = `http://localhost:8080/api/v1/tracks/${userId}?offset=${offset}&limit=${limit}`;

  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  console.log("response: ", data);
  return data;
}

async function fetchUser(userId: string): Promise<SpotifyUser> {
  console.log("fetchUser...");
  const url = `http://localhost:8080/api/v1/user/${userId}`;

  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  console.log("response: ", data);
  return data;
}

async function likeTrack(
  userId: string,
  libraryUserId: string,
  trackId: string
) {
  console.log("likeTrack " + trackId);
  const url = `http://localhost:8080/api/v1/like`;

  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: userId,
      libraryUserId: libraryUserId,
      trackIds: [trackId],
    }),
  });
  const data = await response.text();
  console.log("response: ", data);
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

export { ping, createShareLink, fetchTracks, fetchUser, likeTrack };
export type {
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyImage,
  SpotifyTrack,
  SpotifyUser,
};
