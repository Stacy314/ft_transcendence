import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import CatSprite from '../../components/CatSprite.jsx';
import PetLoadError from '../../components/PetLoadError.jsx';
import Button from '../../components/ui/Button.jsx';
import FormError from '../../components/ui/FormError.jsx';
import FormField from '../../components/ui/FormField.jsx';
import Panel from '../../components/ui/Panel.jsx';
import PanelTitle from '../../components/ui/PanelTitle.jsx';
import { GOTCHIS } from '../../constants/gotchis';
import { useCreatePet, usePet } from '../../hooks/usePet';
import { getApiError } from '../../services/api';
import './style.css';

export default function GotchiSelection() {
  const petQuery = usePet();

  if (petQuery.isPending) return <p role="status">Loading…</p>;
  if (petQuery.isLoadingError) {
    return (
      <Panel as="main" variant="arched" className="gotchi-page">
        <PetLoadError
          error={petQuery.error}
          isRetrying={petQuery.isFetching}
          onRetry={petQuery.refetch}
        />
      </Panel>
    );
  }

  // Creating a Gotchi updates this query, so both entry paths redirect here.
  if (petQuery.data) return <Navigate to="/dashboard" replace />;

  return <GotchiSelectionForm />;
}

function GotchiSelectionForm() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [name, setName] = useState('');
  const { mutate: createPet, error, isPending: isSaving } = useCreatePet();
  const selectedGotchi = GOTCHIS[selectedIndex];
  const trimmedName = name.trim();
  const canSubmit = Boolean(trimmedName) && !isSaving;
  const errorMessage = error && getCreationErrorMessage(error);

  // Add the list length before taking the remainder so moving left from the first item wraps to the last.
  function moveSelection(step) {
    setSelectedIndex(
      (index) => (index + step + GOTCHIS.length) % GOTCHIS.length,
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit) return;

    createPet({ species: selectedGotchi.id, name: trimmedName });
  }

  return (
    <Panel
      as="main"
      variant="arched"
      className="gotchi-page"
      aria-labelledby="gotchi-selection-title"
    >
      <PanelTitle id="gotchi-selection-title" className="gotchi-title">
        Choose your Gotchi
      </PanelTitle>
      <form className="gotchi-form" onSubmit={handleSubmit}>
        <GotchiCarousel
          gotchi={selectedGotchi}
          position={selectedIndex + 1}
          disabled={isSaving}
          onStep={moveSelection}
        />
        <FormField
          id="gotchi-name"
          label="Name:"
          maxLength={20}
          disabled={isSaving}
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        {errorMessage && (
          <FormError className="rounded-2xl">{errorMessage}</FormError>
        )}
        <Button type="submit" className="px-0" disabled={!canSubmit}>
          {isSaving ? 'Saving…' : 'Confirm'}
        </Button>
      </form>
    </Panel>
  );
}

function GotchiCarousel({ gotchi, position, disabled, onStep }) {
  return (
    <div className="gotchi-carousel" role="group" aria-label="Gotchi selection">
      <Button
        variant="round"
        className="gotchi-arrow"
        aria-label="Previous gotchi"
        disabled={disabled}
        onClick={() => onStep(-1)}
      >
        &#9664;
      </Button>
      <Panel variant="inset" className="gotchi-card" aria-live="polite">
        <span className="gotchi-image" aria-hidden="true">
          {gotchi.image ? (
            <CatSprite
              image={gotchi.image}
              label={gotchi.label}
              species={gotchi.id}
            />
          ) : (
            <span className="gotchi-placeholder">?</span>
          )}
        </span>
        <span>{gotchi.label}</span>
        <span className="gotchi-count">
          {position} / {GOTCHIS.length}
        </span>
      </Panel>
      <Button
        variant="round"
        className="gotchi-arrow"
        aria-label="Next gotchi"
        disabled={disabled}
        onClick={() => onStep(1)}
      >
        &#9654;
      </Button>
    </div>
  );
}

// Collect specific field validation messages when the API provides them.
function getCreationErrorMessage(error) {
  const { fields, message } = getApiError(error);
  return Object.values(fields).flat().join('. ') || message;
}
