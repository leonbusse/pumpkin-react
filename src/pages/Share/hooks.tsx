import { useEffect, useState, useContext } from "react";
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

