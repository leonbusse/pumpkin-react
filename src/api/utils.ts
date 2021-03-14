import { getSpotifyLoginUrl } from "./spotify";

export class UnauthorizedError extends Error { }

export async function parse(response: Response): Promise<any> {
  const data = await response.json();
  if (data.error) {
    const errorString = JSON.stringify(data.error);
    if (data.error.statusCode === 401 || data.error.statusCode === "401") {
      console.error("throw UnauthorizedError:", errorString);
      throw new UnauthorizedError(errorString);
    } else {
      throw Error(errorString);
    }
  }
  return data;
}

export async function redirectOnUnauthorized<T>(
  block: () => T,
  destination?: string
): Promise<T | null> {
  try {
    return await block();
  } catch (e) {
    console.error("caught API error:", e);
    if (e instanceof UnauthorizedError) {
      const d = destination || window.location.pathname;
      window.location.href = getSpotifyLoginUrl(d);
    } else {
      console.error(e);
      throw e;
    }
    return null;
  }
}
