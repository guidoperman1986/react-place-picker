import Places from './Places.jsx';
import Error from './Error.jsx';
import { useEffect, useState } from 'react';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';

export default function AvailablePlaces({ onSelectPlace }) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);

  useEffect(() => {
    async function fetchPlaces() {
      setIsLoading(true);
      try {
        const places = await fetchAvailablePlaces();

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
              places, 
              position.coords.latitude, 
              position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
          setIsLoading(false);
      });

      } catch (error) {
        setError({ message: error.message || 'Something went wrong!' });
        setIsLoading(false);
      }
    }
    fetchPlaces();
  }, []);

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
