import useFetch from '../hooks/useFetch.js';
import { fetchAvailablePlaces } from '../http.js';
import { sortPlacesByDistance } from '../loc.js';
import Error from './Error.jsx';
import Places from './Places.jsx';


async function fetchSortedPlaces() {
  const places = await fetchAvailablePlaces();

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        places,
        position.coords.latitude,
        position.coords.longitude
      );

      resolve(sortedPlaces);
    });
  })
}

export default function AvailablePlaces({ onSelectPlace }) {
  const {
    isFetching: isLoading,
    error,
    fetchedPlaces: availablePlaces,
  } = useFetch(fetchSortedPlaces, [])

  if (error) {
    return <Error
      title="An error ocurred"
      message={error.message}
      onConfirm={() => setError(null)}
    />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      loadingText="Loading places..."
      isLoading={isLoading}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />


  );
}
