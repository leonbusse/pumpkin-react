import { FC } from "react";
import { SpotifyTrack } from "../../api/pumpkin";

interface SwipeCardProps {
  track: SpotifyTrack;
}

const SwipeCard: FC<SwipeCardProps> = (props) => {
  const { track } = props;
  const trackName =
    track.name.length > 70 ? track.name.substr(0, 75) + " ..." : track.name;
  return (
    <div className="SongSwiper__card">
      <div
        className="SongSwiper__card-image"
        style={{
          backgroundImage: `url(${track.album.images[0].url})`,
          backgroundSize: "cover",
        }}
      />
      <div className="SongSwiper__card-description">
        <p>{trackName}</p>
        {track.album.artists[0] && (
          <h3>{track.album.artists.map((a) => a.name).join(", ")}</h3>
        )}
        {/* {track.preview_url && <a href={track.preview_url || ""}>Listen</a>} */}
      </div>
    </div>
  );
};

export { SwipeCard };
