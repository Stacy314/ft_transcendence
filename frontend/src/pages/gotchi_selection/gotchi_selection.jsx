import './style.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GOTCHIS } from './gotchis.js';
import { getAuthenticatedUser } from '../../utils/auth.js';
import { saveCurrentUserGotchi } from '../../utils/gotchi_storage.js';

export default function GotchiSelection() {
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);
    const current = GOTCHIS[index];
    const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

    function move(step) {
        setIndex((i) => (i + step + GOTCHIS.length) % GOTCHIS.length);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (isSubmitting) return;

        const user = getAuthenticatedUser();
        if (!user?.id && !user?.username) {
          setError('No active user found. Please log in again.');
          return;
        }

        setError('');
        setIsSubmitting(true);

        const payload = {
          pet: {
            name: name.trim(),
            species: current.id,
            owner_id: user?.id,
            owner_username: user?.username,
          },
        };

        try {
          const response = await fetch('/api/pets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          const data = await response.json().catch(() => ({}));
          if (!response.ok) {
            const apiError = Array.isArray(data.errors) ? data.errors.join(' ') : 'Could not create pet.';
            throw new Error(apiError);
          }

          saveCurrentUserGotchi({
            id: data?.pet?.id,
            type: current.id,
            name: name.trim(),
          });
          navigate('/dashboard');
        } catch (submitError) {
          setError(submitError.message || 'Could not create pet.');
        } finally {
          setIsSubmitting(false);
        }
    }

    return (
        <main className="gotchi-page">
          <div className="gotchi-title">Choose your Gotchi</div>
          <form className="gotchi-form" onSubmit={handleSubmit}>
            <div className="gotchi-carousel" aria-label="Gotchi selection">
              <button type="button" className="gotchi-arrow" aria-label="Previous gotchi" onClick={() => move(-1)}>
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
              <button type="button" className="gotchi-arrow" aria-label="Next gotchi" onClick={() => move(1)}>
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={!name.trim() || isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Confirm'}
            </button>
            {!!error && <p className="gotchi-error" role="alert">{error}</p>}
          </form>
        </main>
    );
}
