import { useRef, useState, useCallback, useEffect } from 'react';

import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import { fetchUserPlaces, updateUserPlaces } from './http.js';
import Error from './components/Error.jsx';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const selectedPlace = useRef();

  useEffect(() => {
    setIsLoading(true);
    async function loadUserPlaces() {
      try {
        const places = await fetchUserPlaces();
        setUserPlaces(places);
        setIsLoading(false);
      } catch (error) {
        setErrorUpdatingPlaces(error.message || 'Something went wrong!');
        setIsLoading(false);
      }
    }
    loadUserPlaces();
  }, []);

  const [userPlaces, setUserPlaces] = useState([]);
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

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
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );

    try {
      await updateUserPlaces(userPlaces);
    } catch (error) {
      setErrorUpdatingPlaces(error.message || 'Something went wrong!');
      setUserPlaces(userPlaces);
    }

    setModalIsOpen(false);
  }, []);

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
