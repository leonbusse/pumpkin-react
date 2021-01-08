import { redirectOnUnauthorized, parse } from "./utils";

const pumpkinEndpoint = process.env.REACT_APP_PUMPKIN_ENDPOINT;
const baseUrl = process.env.REACT_APP_BASE_URL;

export async function ping() {
  console.log("ping...");
  return fetch(`${pumpkinEndpoint}api/v1/ping`)
    .then((response) => response.text())
    .then((data) => console.log("response: " + data));
}

export async function createShareLink(
  spotifyAccessToken: string
): Promise<string | null> {
  console.log("createShareLink...");
  return redirectOnUnauthorized(async () => {
    const response = await fetch(`${pumpkinEndpoint}api/v1/import`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ spotifyAccessToken: spotifyAccessToken }),
    });
    const data = await parse(response);
    return baseUrl + `share/${data.shareId}`;
  });
}

export async function fetchTracks(
  userId: string,
  offset: number,
  limit: number
): Promise<PumpkinTrack[] | null> {
  console.log("fetchTracks...");
  return redirectOnUnauthorized(async () => {
    const url = `${pumpkinEndpoint}api/v1/tracks/${userId}?offset=${offset}&limit=${limit}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const data = await parse(response);
    return data as PumpkinTrack[];
  });
}

export async function fetchUser(userId: string): Promise<PumpkinUser> {
  console.log(`fetchUser ${userId}...`);
  return redirectOnUnauthorized(async () => {
    const url = `${pumpkinEndpoint}api/v1/user/${userId}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const data = await parse(response);
    return data;
  });
}

export async function createPlaylist(
  userId: string,
  libraryUserId: string,
  playlistName: string,
  trackIds: string[],
  spotifyAccessToken: string
): Promise<string | null> {
  console.log("createPlaylist...");
  return redirectOnUnauthorized(async () => {
    const response = await fetch(`${pumpkinEndpoint}api/v1/create-playlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        spotifyAccessToken: spotifyAccessToken,
        userId: userId,
        libraryUserId: libraryUserId,
        playlistName: playlistName,
        trackIds: trackIds,
      }),
    });
    const data = await parse(response);
    return data;
  });
}

export interface PumpkinTrack {
  id: string;
  name: string;
  previewUrl: string | null;
  album: string;
  artists: string[];
  imageUrl: string;
}

export interface PumpkinUser {
  id: string;
  displayName: string;
  email: string;
}
