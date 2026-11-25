import './style.css';
import { GOTCHIS } from '../gotchi_selection/gotchis.js';
import { Navigate } from 'react-router-dom';
import { usePet, useFeedPet, usePlayWithPet, useCleanPet } from '../../hooks/usePet';
import { useCooldown } from '../../hooks/useCooldown';
import { getApiError } from '../../services/api';

// One Feed/Play/Clean button: replenishes its stat, then disables itself for the remaining cooldown.
function ActionButton({ label, mutation, readyAt }) {
  const remaining = useCooldown(readyAt);
  const onCooldown = remaining > 0;
  return (
    <button
      type="button"
      disabled={onCooldown || mutation.isPending}
      onClick={() => mutation.mutate()}
    >
      {onCooldown ? `${label} (${remaining}s)` : label}
    </button>
  );
}

export default function Dashboard() {
  const { data: gotchi, isPending, isError, error, refetch, isFetching } = usePet();
  const feed = useFeedPet();
  const play = usePlayWithPet();
  const clean = useCleanPet();

  if (isPending) return <p role="status">Loading your Gotchi…</p>;
  if (isError) return (
    <main className="dashboard-page" role="alert">
      <p>{getApiError(error).message}</p>
      <button type="button" disabled={isFetching} onClick={() => refetch()}>Try again</button>
    </main>
  );
  if (!gotchi) return <Navigate to="/gotchi-selection" replace />;
  const type = GOTCHIS.find((g) => g.id === gotchi.species);
  const readyAt = gotchi.ready_at || {};
  // A rejected action has to say so instead of looking like nothing happened.
  const rejected = [feed, play, clean].find((m) => m.isError);

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
          <ActionButton label="Feed" mutation={feed} readyAt={readyAt.feed} />
          <ActionButton label="Play" mutation={play} readyAt={readyAt.play} />
          <ActionButton label="Clean" mutation={clean} readyAt={readyAt.clean} />
        </div>
        {rejected && <p role="alert">{getApiError(rejected.error).message}</p>}
      </div>
    </main>
  );
}
