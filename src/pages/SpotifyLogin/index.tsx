import { FC } from "react";
import { RouteComponentProps } from "react-router-dom";
import { getSpotifyLoginUrl } from "../../api/spotify";

interface SpotifyLoginProps extends RouteComponentProps<{}> {}
const SpotifyLogin: FC<SpotifyLoginProps> = (props) => {
  const splits = props.location.search.split("?", 2);
  console.log(splits);
  const destination = splits[1]
    ?.split("&")
    ?.find((param) => param.startsWith("destination"))
    ?.split("=")[1];
  console.log("destination: " + destination);
  window.location.href = getSpotifyLoginUrl(destination);
  return <></>;
};

export { SpotifyLogin };
