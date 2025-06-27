import { useCallback, useRef, useState } from 'react';

import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import Error from './components/Error.jsx';
import Modal from './components/Modal.jsx';
import Places from './components/Places.jsx';
import useFetch from './hooks/useFetch.js';
import { fetchUserPlaces, updateUserPlaces } from './http.js';

function App() {
  const selectedPlace = useRef();
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { fetchedPlaces: userPlaces, error, isLoading, setFetchedPlaces: setUserPlaces } = useFetch(fetchUserPlaces, []);

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    try {
      await updateUserPlaces([selectedPlace, ...userPlaces]);

    } catch (error) {
      setErrorUpdatingPlaces(error.message || 'Something went wrong!');
      setUserPlaces(userPlaces);
    }

  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    const updatedPlaces = userPlaces.filter((place) => place.id !== selectedPlace.current.id)
    setUserPlaces(updatedPlaces);

    try {
      await updateUserPlaces(updatedPlaces);
    } catch (error) {
      setErrorUpdatingPlaces(error.message || 'Something went wrong!');
      setUserPlaces(userPlaces);
    }

    setModalIsOpen(false);
  }, [userPlaces/* , setUserPlaces */]);

  return (
    <>
      <Modal open={errorUpdatingPlaces} onClose={() => setErrorUpdatingPlaces(null)}>
        <Error
          title="An error ocurred"
          message={errorUpdatingPlaces}
          onConfirm={() => setErrorUpdatingPlaces(null)}
        />
      </Modal>

      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
          isLoading={isLoading}
          loadingText="Loading places..."
        />

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}


export default App;