import React, { FC, useState, useCallback } from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { PumpkinTrack } from "../../api/pumpkin";
import { Button } from "../../components/Button";
import { DeleteButton } from "../../components/DeleteButton";
import { TrackList } from "../../components/TrackList";

interface OverviewScreenProps {
  likes: PumpkinTrack[];
  onDone: () => void;
  onDelete: (tracks: PumpkinTrack[]) => void;
}

export const OverviewScreen: FC<OverviewScreenProps> = (props) => {
  const { likes, onDone, onDelete } = props;
  return (
    <Flex
      as="section"
      flexDirection="column"
      justifyContent="start"
      alignItems="center"
      width="100%"
      height="100%"
      padding="2em 0 3em 0"
    >
      <Heading size="2xl">Liked Tracks</Heading>
      <LikesList likes={likes} onDelete={onDelete} onDone={onDone} />
    </Flex>
  );
};

interface LikesListProps {
  likes: PumpkinTrack[];
  onDone: () => void;
  onDelete: (tracks: PumpkinTrack[]) => void;
}

const LikesList: FC<LikesListProps> = (props) => {
  const { likes, onDone, onDelete } = props;

  const [selected, setSelected] = useState<PumpkinTrack[]>([]);
  const onSelect = useCallback(
    (track: PumpkinTrack) => {
      if (selected.includes(track)) {
        setSelected(selected.filter((t) => t !== track));
      } else {
        setSelected([...selected, track]);
      }
    },
    [selected]
  );

  const onDeleteButton = useCallback(() => {
    onDelete(selected);
    setSelected([]);
  }, [selected, onDelete]);

  return (
    <>
      <TrackList tracks={likes} onSelect={onSelect} selected={selected} />
      <Box flex="1" />
      <Box
        height="1em"
        _before={{
          content: '""',
          position: "relative",
          bottom: "6em",
          zIndex: "100",
          display: "inline-block",
          height: "6em",
          pointerEvents: "none",
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))",
          width: "100vw",
        }}
      />
      <Flex flexDirection="row">
        <Box width="4em" />
        <Button disabled={!likes || likes.length === 0} onClick={onDone}>
          Add to my Spotify
        </Button>
        <Box width="1em" />
        <DeleteButton
          opacity={selected.length > 0 ? "1" : "0"}
          onClick={onDeleteButton}
        />
      </Flex>
    </>
  );
};
