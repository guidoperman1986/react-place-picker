import { useEffect, useState } from "react";

export default function useFetch(fetchFn, initialValue) {
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState(null);
    const [fetchedPlaces, setFetchedPlaces] = useState(initialValue);

    useEffect(() => {
        setIsFetching(true);
        async function loadUserPlaces() {
            try {
                const places = await fetchFn();
                setFetchedPlaces(places);
            } catch (error) {
                setError(error.message || 'Something went wrong!');
            }

            setIsFetching(false);
        }
        loadUserPlaces();
    }, [fetchFn]);

    return {
        fetchedPlaces,
        error,
        isLoading: isFetching,
        setFetchedPlaces
    };
}