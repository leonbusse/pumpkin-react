import { FC } from "react";
import { RouteComponentProps } from "react-router-dom";
import { getSpotifyLoginUrl } from "../../api/spotify";

interface SpotifyLoginProps extends RouteComponentProps<{}> {}

export const SpotifyLogin: FC<SpotifyLoginProps> = (props) => {
  const destination = getUrlDestination(props.location.search) || "/";
  console.log("would redirect to " + getSpotifyLoginUrl(destination));
  window.location.href = getSpotifyLoginUrl(destination);
  return <></>;
};

function getUrlDestination(url: string): string | undefined {
  console.log(`getUrlDestination: ${url}`);
  const splits = url.split("?", 2);
  const destination = splits[1]
    ?.split("&")
    ?.find((param) => param.startsWith("destination"))
    ?.split("=")[1];
  console.log(`- destination: ${destination}`);
  return destination;
}
