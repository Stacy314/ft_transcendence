import './style.css';
import { GOTCHIS } from '../gotchi_selection/gotchis.js';
import { Navigate } from 'react-router-dom';
import { usePet } from '../../hooks/usePet';
import { getApiError } from '../../services/api';

export default function Dashboard() {
  const { data: gotchi, isPending, isError, error, refetch, isFetching } = usePet();
  if (isPending) return <p role="status">Loading your Gotchi…</p>;
  if (isError) return (
    <main className="dashboard-page" role="alert">
      <p>{getApiError(error).message}</p>
      <button type="button" disabled={isFetching} onClick={() => refetch()}>Try again</button>
    </main>
  );
  if (!gotchi) return <Navigate to="/gotchi-selection" replace />;
  const type = GOTCHIS.find((g) => g.id === gotchi.species);

  return (
    <main className="dashboard-page">
      <div className="dashboard-title">{gotchi.name || 'Your Gotchi'}</div>
      <div className="dashboard-card">
        <div className="dashboard-pet" aria-label="virtual pet">
          {type?.image
            ? <img src={type.image} alt={type.label} />
            : <span className="dashboard-placeholder">?</span>}
        </div>
        <div className="dashboard-stats">
          <div><span>Hunger</span><strong>{gotchi.hunger}%</strong></div>
          <div><span>Health</span><strong>{gotchi.health}%</strong></div>
          <div><span>Energy</span><strong>{gotchi.energy}%</strong></div>
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
