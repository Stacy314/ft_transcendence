import './style.css';
import cozyRoom from '../../assets/gotchi-cozy-room.png';
import CatSprite from '../../components/CatSprite.jsx';
import { GOTCHIS } from '../gotchi_selection/gotchis.js';
import { Navigate } from 'react-router-dom';
import { usePet } from '../../hooks/usePet';
import { getApiError } from '../../services/api';

function checkPetState({ gotchi, isPending, isError, error, refetch, isFetching }) {
  if (isPending) return <p role="status">Loading your Gotchi…</p>;

  if (isError) return (
    <main className="dashboard-page" role="alert">
      <p>{getApiError(error).message}</p>
      <button type="button" disabled={isFetching} onClick={() => refetch()}>Try again</button>
    </main>
  );

  if (!gotchi) return <Navigate to="/gotchi-selection" replace />;

  return null;
}

function StatBar({ name, value }) {
  return (
    <div className={`dashboard-stat dashboard-stat-${name.toLowerCase()}`}>
      <div className="dashboard-stat-label">
        <span>{name}</span>
        <strong>{value}%</strong>
      </div>
      <progress aria-label={name} max={100} value={value} />
    </div>
  );
}

export default function Dashboard() {

  const { data: gotchi, isPending, isError, error, refetch, isFetching } = usePet();

  const stateView = checkPetState({ gotchi, isPending, isError, error, refetch, isFetching });
  if (stateView) return stateView;

  const type = GOTCHIS.find((g) => g.id === gotchi.species);

  return (
    <main className="dashboard-page" aria-labelledby="dashboard-gotchi-name">
      <div className="dashboard-card">
        <header className="dashboard-heading">
          <h1 className="dashboard-title" id="dashboard-gotchi-name">
            {gotchi.name || 'Your Gotchi'}
          </h1>
        </header>
        <div className="dashboard-scene" role="group" aria-label="Gotchi play area in a cozy room">
          <img
            className="dashboard-scene-background"
            src={cozyRoom}
            alt=""
            aria-hidden="true"
            draggable={false}
          />
          <div className="dashboard-pet">
            {type?.image
              ? <CatSprite className="dashboard-pet-image" image={type.image} label={type.label} species={type.id} />
              : <span className="dashboard-placeholder">?</span>}
          </div>
        </div>
        <div className="dashboard-stats">
          <StatBar name="Hunger" value={gotchi.hunger} />
          <StatBar name="Health" value={gotchi.health} />
          <StatBar name="Energy" value={gotchi.energy} />
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
