import './style.css';
import cozyRoom from '../../assets/gotchi-cozy-room.png';
import CatSprite from '../../components/CatSprite.jsx';
import PetActionEffect from '../../components/PetActionEffect.jsx';
import { GOTCHIS } from '../gotchi_selection/gotchis.js';
import { Navigate } from 'react-router-dom';
import { usePet } from '../../hooks/usePet';
import { usePetActionAnimation } from '../../hooks/usePetActionAnimation';
import { getApiError } from '../../services/api';

const CARE_ACTIONS = [
  { type: 'feed', label: 'Feed', message: 'Food time.' },
  { type: 'play', label: 'Play', message: 'Playing with a ball.' },
  { type: 'clean', label: 'Clean', message: 'Bubble bath.' },
];

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

function DashboardContent({ gotchi }) {
  const { activeAction, playAction, finishAction } = usePetActionAnimation();
  const type = GOTCHIS.find((g) => g.id === gotchi.species);
  const actionMessage = CARE_ACTIONS.find(action => action.type === activeAction?.type)?.message;

  return (
    <main className="dashboard-page" aria-labelledby="dashboard-gotchi-name">
      <div className="dashboard-card">
        <header className="dashboard-heading">
          <h1 className="dashboard-title" id="dashboard-gotchi-name">
            {gotchi.name || 'Your Gotchi'}
          </h1>
        </header>
        <div className="dashboard-scene" id="dashboard-gotchi-scene" role="group" aria-label="Gotchi play area in a cozy room">
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
            {activeAction && (
              <PetActionEffect
                key={activeAction.id}
                action={activeAction.type}
                onComplete={() => finishAction(activeAction.id)}
              />
            )}
          </div>
        </div>
        <p className="sr-only" role="status" aria-atomic="true">{actionMessage || ''}</p>
        <div className="dashboard-stats">
          <StatBar name="Hunger" value={gotchi.hunger} />
          <StatBar name="Health" value={gotchi.health} />
          <StatBar name="Energy" value={gotchi.energy} />
        </div>
        <div className="dashboard-actions">
          {CARE_ACTIONS.map(action => (
            <button
              key={action.type}
              type="button"
              aria-controls="dashboard-gotchi-scene"
              data-playing={activeAction?.type === action.type || undefined}
              onClick={() => playAction(action.type)}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function Dashboard() {
  const { data: gotchi, isPending, isError, error, refetch, isFetching } = usePet();
  const stateView = checkPetState({ gotchi, isPending, isError, error, refetch, isFetching });
  if (stateView) return stateView;

  return <DashboardContent key={gotchi.id} gotchi={gotchi} />;
}
