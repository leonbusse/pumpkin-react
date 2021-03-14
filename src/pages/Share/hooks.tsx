import { useEffect, useState, useContext, useCallback, useRef } from "react";
import {
    fetchTracks,
    fetchUserByShareId,
    PumpkinTrack,
    PumpkinUser,
} from "../../api/pumpkin";
import { globalSetters, GlobalStateContext } from "../../state";
import { fetchLoggedInUser } from "../../api/spotify";
import { useApiCall } from "../../util";


export function useSharePageData(shareId: string, trackIndex: number) {
    const { user, error: userError } = useLoggedInUser();

    const { user: libraryUser, error: libraryUserError } = useUserDataByShareId(
        shareId
    );

    const { tracks, ratedAllTracks, error: trackError } = useTrackPagination(
        shareId,
        trackIndex
    );

    return {
        userId: user?.id,
        libraryUser,
        tracks,
        ratedAllTracks,
        error: userError || libraryUserError || trackError,
    };
}

function useUserDataByShareId(
    shareId: string
): { user: PumpkinUser | null; error: Error | null } {
    const { data, error } = useApiCall(shareId, fetchUserByShareId);
    return { user: data, error };
}

function useLoggedInUser() {
    const { user, accessToken } = useContext(GlobalStateContext).spotify;
    const { setSpotifyState } = globalSetters;
    const arg = user ? null : accessToken; // nothing is fetched with a null argument
    const { data, error } = useApiCall(arg, fetchLoggedInUser);
    if (!user && data) {
        setSpotifyState({ user: data });
    }
    return { user, error };
}

function useTrackPagination(shareId: string, trackIndex: number) {
    const [error, setError] = useState(null);
    const [tracks, setTracks] = useState<Record<number, PumpkinTrack>>({});
    const [fetchedAllTracks, setFetchedAllTracks] = useState(false);
    const [fetchingTracks, setFetchingTracks] = useState(false);

    const availableIndecies = Object.keys(tracks);
    const lastAvailableIndex =
        availableIndecies.length > 0
            ? Math.max(...availableIndecies.map((k) => parseInt(k, 10)))
            : -1;

    useEffect(() => {
        (async () => {
            if (
                !fetchedAllTracks &&
                !fetchingTracks &&
                lastAvailableIndex - trackIndex <= 2
            ) {
                try {
                    setFetchingTracks(true);
                    const fetchIndex = lastAvailableIndex + 1;
                    const newTracks = await fetchTracks(shareId, fetchIndex, 3);
                    if (!newTracks) return;

                    if (newTracks.length === 0) {
                        setFetchedAllTracks(true);
                        return;
                    }
                    const newTracksRecord: Record<number, PumpkinTrack> = {};
                    newTracks.forEach((t: PumpkinTrack, i: number) => {
                        newTracksRecord[fetchIndex + i] = t;
                    });
                    const updatedTracks: Record<number, PumpkinTrack> = {
                        ...tracks,
                        ...newTracksRecord,
                    };
                    setTracks(updatedTracks);
                    setFetchingTracks(false);
                } catch (e) {
                    setError(e);
                }
            }
        })();
    }, [
        shareId,
        trackIndex,
        tracks,
        fetchingTracks,
        fetchedAllTracks,
        lastAvailableIndex,
    ]);
    const ratedAllTracks = fetchedAllTracks && trackIndex > lastAvailableIndex;
    return { tracks, ratedAllTracks, error };
}

export function useUnlockedAudio() {
    useEffect(() => {
        document.body.addEventListener('click', unlockAudio);
        document.body.addEventListener('touchstart', unlockAudio);
        return () => {
            document.body.removeEventListener('click', unlockAudio)
            document.body.removeEventListener('touchstart', unlockAudio)
        }
    }, []);
}

function unlockAudio() {
    const sound = new Audio("https://odattachmentmdr-a.akamaihd.net/mp4audiomobil/e/digas-ee50cbdf-9279-4bde-8f78-48ab89a0513a-0a15de5e5053_ee.mp3");
    sound.play().catch(() => { });
    sound.pause();
    sound.currentTime = 0;
    document.body.removeEventListener('click', unlockAudio)
    document.body.removeEventListener('touchstart', unlockAudio)
}

export function usePlayer(trackIndex: number) {
    const audioPlayerRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlayling] = useState(false);

    const togglePlayback = useCallback(() => {
        if (audioPlayerRef && audioPlayerRef.current) {
            if (audioPlayerRef.current.paused) {
                setPlayling(true);
            } else {
                setPlayling(false);
            }
        }
    }, [audioPlayerRef, setPlayling]);

    useEffect(() => {
        if (audioPlayerRef && audioPlayerRef.current) {
            if (playing) {
                audioPlayerRef.current.play();
            } else {
                audioPlayerRef.current.pause();
            }
        }
    }, [audioPlayerRef, playing, trackIndex]);

    return { togglePlayback, playing, setPlayling, audioPlayerRef };
}