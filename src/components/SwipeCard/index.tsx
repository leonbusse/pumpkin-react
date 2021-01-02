import { FC } from "react";
import { SpotifyTrack } from "../../api/pumpkin";

interface SwipeCardProps {
  track: SpotifyTrack;
}

const SwipeCard: FC<SwipeCardProps> = (props) => {
  const { track } = props;
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
        <p>{track.name}</p>
        {track.album.artists[0] && <h3>by {track.album.artists[0].name}</h3>}
        {/* {track.preview_url && <a href={track.preview_url || ""}>Listen</a>} */}
      </div>
    </div>
  );
};

export { SwipeCard };
