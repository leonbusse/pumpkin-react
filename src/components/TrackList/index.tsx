import { Box, ListItem, UnorderedList, useTheme, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import { PumpkinTrack } from "../../api/pumpkin";

interface TrackListProps {
  tracks: PumpkinTrack[];
  selected: PumpkinTrack[];
  onSelect: (track: PumpkinTrack) => void;
}

export const TrackList: FC<TrackListProps> = (props) => {
  const { tracks: likes, selected, onSelect } = props;
  const theme = useTheme();
  return (
    <Box width="100%" padding="0 1em" overflowY="scroll">
      <UnorderedList margin="0" textAlign="center" padding="2em 0">
        {likes && likes.length > 0 ? (
          [...likes, null].map((track) =>
            track === null ? (
              <Box height="2em" key="spacer" />
            ) : (
              <ListItem
                listStyleType="none"
                maxWidth={{ base: "70vw", md: "32em" }}
                margin="0 auto"
                cursor="pointer"
                onClick={() => onSelect(track)}
                key={track.id}
              >
                <Text
                  fontSize={{ base: "1.15em", md: "1.5em" }}
                  color={
                    selected.includes(track)
                      ? theme.colors.accent
                      : theme.colors.primary
                  }
                  isTruncated
                >
                  {track.name}
                </Text>
                <Text
                  fontSize={{ base: "1em", md: "1.25em" }}
                  color={
                    selected.includes(track)
                      ? theme.colors.accent
                      : theme.colors.primary
                  }
                  fontWeight="700"
                  isTruncated
                >
                  {track.artists.join(", ")}
                </Text>
                <Box height="1em" />
              </ListItem>
            )
          )
        ) : (
          <Text padding="2em">
            You have not liked a song yet.
            <br />
            Go listen to some music!
          </Text>
        )}
      </UnorderedList>
    </Box>
  );
};
