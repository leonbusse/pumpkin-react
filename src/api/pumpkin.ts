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

export { ping, createShareLink };
