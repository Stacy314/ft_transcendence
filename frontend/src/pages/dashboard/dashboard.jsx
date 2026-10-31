import './style.css';
import { GOTCHIS } from '../gotchi_selection/gotchis.js';
import { loadCurrentUserGotchi } from '../../utils/gotchi_storage.js';

export default function Dashboard() {
  const gotchi = loadCurrentUserGotchi();
  const type = GOTCHIS.find((g) => g.id === gotchi.type) || GOTCHIS[0];

  return (
    <main className="dashboard-page">
      <div className="dashboard-title">{gotchi.name || 'Your Gotchi'}</div>
      <div className="dashboard-card">
        <div className="dashboard-pet" aria-label="virtual pet">
          {type.image
            ? <img src={type.image} alt={type.label} />
            : <span className="dashboard-placeholder">?</span>}
        </div>
        <div className="dashboard-stats">
          <div><span>Hunger</span><strong>72%</strong></div>
          <div><span>Happiness</span><strong>86%</strong></div>
          <div><span>Energy</span><strong>64%</strong></div>
        </div>
        <div className="dashboard-actions">
          <button type="button">Feed</button>
          <button type="button">Play</button>
          <button type="button">Clean</button>
        </div>
      </div>
    </main>
  );
}
