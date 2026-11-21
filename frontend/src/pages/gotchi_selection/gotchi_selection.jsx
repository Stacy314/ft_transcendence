import './style.css';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { GOTCHIS } from './gotchis.js';
import { useCreatePet, usePet } from '../../hooks/usePet';
import { getApiError } from '../../services/api';

export default function GotchiSelection() {
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);
    const current = GOTCHIS[index];
    const [name, setName] = useState('');
    const petQuery = usePet();
    const createMutation = useCreatePet();

    if (petQuery.isPending) return <p role="status">Loading…</p>;
    if (petQuery.isError) return (
      <main className="gotchi-page" role="alert">
        <p>{getApiError(petQuery.error).message}</p>
        <button type="button" disabled={petQuery.isFetching} onClick={() => petQuery.refetch()}>Try again</button>
      </main>
    );
    if (petQuery.data) return <Navigate to="/dashboard" replace />;

    const apiError = createMutation.error ? getApiError(createMutation.error) : null;
    const errorMessage = apiError && (Object.values(apiError.fields).flat().join('. ') || apiError.message);

    function move(step) {
        setIndex((i) => (i + step + GOTCHIS.length) % GOTCHIS.length);
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (createMutation.isPending || !name.trim()) return;
        createMutation.mutate({ species: current.id, name: name.trim() }, {
            onSuccess: () => navigate('/dashboard', { replace: true }),
        });
    }

    return (
        <main className="gotchi-page">
          <div className="gotchi-title">Choose your Gotchi</div>
          <form className="gotchi-form" onSubmit={handleSubmit}>
            <div className="gotchi-carousel" aria-label="Gotchi selection">
              <button type="button" className="gotchi-arrow" aria-label="Previous gotchi" disabled={createMutation.isPending} onClick={() => move(-1)}>
                &#9664;
              </button>
              <div className="gotchi-card" aria-live="polite">
                <span className="gotchi-image">
                  {current.image
                    ? <img src={current.image} alt={current.label} />
                    : <span className="gotchi-placeholder">?</span>}
                </span>
                <span>{current.label}</span>
                <span className="gotchi-count">{index + 1} / {GOTCHIS.length}</span>
              </div>
              <button type="button" className="gotchi-arrow" aria-label="Next gotchi" disabled={createMutation.isPending} onClick={() => move(1)}>
                &#9654;
              </button>
            </div>

            <div className="gotchi-field">
              <label htmlFor="gotchi-name">Name:</label>
              <input
                type="text"
                id="gotchi-name"
                name="gotchi-name"
                maxLength={20}
                disabled={createMutation.isPending}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {errorMessage && <p className="gotchi-error" role="alert">{errorMessage}</p>}
            <button type="submit" disabled={!name.trim() || createMutation.isPending}>{createMutation.isPending ? 'Saving…' : 'Confirm'}</button>
          </form>
        </main>
    );
}
