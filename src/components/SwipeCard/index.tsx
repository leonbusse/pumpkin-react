import React, { FC } from "react";
import { SpotifyTrack } from "../../api/pumpkin";
import { Box, Grid, Text } from "@chakra-ui/react";

interface SwipeCardProps {
  track: SpotifyTrack;
}

const cardWidthVw = 80;
const descriptionHeightVw = 20;
const cardMaxWidthEm = 24;
const descriptionMaxHeightEm =
  (descriptionHeightVw / cardWidthVw) * cardMaxWidthEm;

const SwipeCard: FC<SwipeCardProps> = (props) => {
  const { track } = props;
  const trackName =
    track.name.length > 70 ? track.name.substr(0, 75) + " ..." : track.name;

  return (
    <Box
      width={`${cardWidthVw}vw`}
      height={`${cardWidthVw + descriptionHeightVw}vw`}
      maxHeight={`${cardMaxWidthEm + descriptionMaxHeightEm}em`}
      maxWidth={`${cardMaxWidthEm}em`}
      backgroundColor="black"
      color="white"
      borderRadius="10px"
      overflow="hidden"
      boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.2)"
    >
      <Box
        width={`${cardWidthVw}vw`}
        height={`${cardWidthVw}vw`}
        maxHeight={`${cardMaxWidthEm}em`}
        maxWidth={`${cardMaxWidthEm}em`}
        borderRadius="10px 10px 0 0"
        backgroundImage={`url(${track.album.images[0].url})`}
        backgroundSize="cover"
      />
      <Grid
        columns={1}
        alignContent="center"
        padding="0 1em"
        height={`${descriptionHeightVw}vw`}
        maxHeight={`${descriptionMaxHeightEm}em`}
      >
        <Text fontSize={{ base: "1em", md: "1.25em" }} isTruncated width="100%">
          {trackName}
        </Text>
        {track.album.artists[0] && (
          <Text
            fontSize={{ base: "1em", md: "1.25em" }}
            fontWeight="700"
            isTruncated
            width="100%"
          >
            {track.album.artists.map((a) => a.name).join(", ")}
          </Text>
        )}
      </Grid>
    </Box>
  );
};

export { SwipeCard };
