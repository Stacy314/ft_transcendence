import './style.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GOTCHIS } from './gotchis.js';

export default function GotchiSelection() {
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);
    const current = GOTCHIS[index];
    const [name, setName] = useState('');

    function move(step) {
        setIndex((i) => (i + step + GOTCHIS.length) % GOTCHIS.length);
    }

    function handleSubmit(event) {
        event.preventDefault();
        localStorage.setItem('gotchi', JSON.stringify({ type: current.id, name: name.trim() }));
        navigate('/dashboard');
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

            <button type="submit" disabled={!name.trim()}>Confirm</button>
          </form>
        </main>
    );
}
