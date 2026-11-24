import { Navigate } from 'react-router-dom';
import cozyRoom from '../../assets/gotchi-cozy-room.png';
import CatSprite from '../../components/CatSprite.jsx';
import PetActionEffect from '../../components/PetActionEffect.jsx';
import PetLoadError from '../../components/PetLoadError.jsx';
import Button from '../../components/ui/Button.jsx';
import Panel from '../../components/ui/Panel.jsx';
import PanelTitle from '../../components/ui/PanelTitle.jsx';
import { GOTCHIS, usePet } from '../../hooks/usePet';
import { usePetActionAnimation } from '../../hooks/usePetActionAnimation';
import './style.css';

const PAGE_CLASSES =
  'dashboard-page grid w-[min(34rem,92vw)] min-w-0 self-center py-6';
const SCENE_ID = 'dashboard-gotchi-scene';

const GOTCHI_STATS = [
  { key: 'hunger', label: 'Hunger', color: '#f58b68' },
  { key: 'health', label: 'Health', color: '#87c96b' },
  { key: 'energy', label: 'Energy', color: '#7b9fed' },
];

const CARE_ACTIONS = [
  { type: 'feed', label: 'Feed', message: 'Food time.' },
  { type: 'play', label: 'Play', message: 'Playing with a ball.' },
  { type: 'clean', label: 'Clean', message: 'Bubble bath.' },
];

export default function Dashboard() {
  const {
    data: gotchi,
    isPending,
    isLoadingError,
    error,
    refetch,
    isFetching,
  } = usePet();

  if (isPending) {
    return (
      <main>
        <p role="status">Loading your Gotchi…</p>
      </main>
    );
  }

  if (isLoadingError) {
    return (
      <main className={PAGE_CLASSES}>
        <PetLoadError error={error} isRetrying={isFetching} onRetry={refetch} />
      </main>
    );
  }

  if (!gotchi) return <Navigate to="/gotchi-selection" replace />;

  return <DashboardContent key={gotchi.id} gotchi={gotchi} />;
}

function DashboardContent({ gotchi }) {
  const { activeAction, playAction, finishAction } = usePetActionAnimation();

  return (
    <main className={PAGE_CLASSES} aria-labelledby="dashboard-gotchi-name">
      <Panel
        variant="arched"
        className="dashboard-card grid w-full min-w-0 gap-4"
      >
        <header className="grid min-w-0 justify-items-center px-5">
          <PanelTitle
            className="dashboard-title px-6"
            id="dashboard-gotchi-name"
          >
            {gotchi.name || 'Your Gotchi'}
          </PanelTitle>
        </header>
        <GotchiScene
          speciesId={gotchi.species}
          activeAction={activeAction}
          onActionComplete={finishAction}
        />
        <GotchiStats gotchi={gotchi} />
        <GotchiCareActions
          activeActionType={activeAction?.type}
          onPlayAction={playAction}
        />
      </Panel>
    </main>
  );
}

function GotchiScene({ speciesId, activeAction, onActionComplete }) {
  const species = GOTCHIS.find((gotchiType) => gotchiType.id === speciesId);

  return (
    <Panel
      variant="inset"
      className="dashboard-scene relative aspect-[16/10] w-full min-w-0 overflow-hidden"
      id={SCENE_ID}
      role="group"
      aria-label="Gotchi play area in a cozy room"
    >
      <img
        className="pointer-events-none absolute inset-0 size-full object-cover"
        src={cozyRoom}
        alt=""
        aria-hidden="true"
        draggable={false}
      />
      <div className="dashboard-pet absolute bottom-[8%] left-1/2 z-1 grid aspect-square -translate-x-1/2 place-items-center text-[5rem]">
        {species?.image ? (
          <CatSprite
            className="relative size-full object-contain [image-rendering:pixelated]"
            image={species.image}
            label={species.label}
            species={species.id}
          />
        ) : (
          <span className="grid size-full place-items-center rounded-lg border-2 border-dashed border-white">
            ?
          </span>
        )}
        {/* Each click gets its own key so repeated actions restart the animation. */}
        {activeAction && (
          <PetActionEffect
            key={activeAction.id}
            action={activeAction.type}
            onComplete={() => onActionComplete(activeAction.id)}
          />
        )}
      </div>
    </Panel>
  );
}

function GotchiStats({ gotchi }) {
  return (
    <div className="mx-2 grid grid-cols-3 gap-3 rounded-3xl bg-[#fff3da80] p-3">
      {GOTCHI_STATS.map(({ key, label, color }) => (
        <StatBar key={key} label={label} value={gotchi[key]} color={color} />
      ))}
    </div>
  );
}

function StatBar({ label, value, color }) {
  return (
    <div>
      <div className="dashboard-stat-label flex flex-col items-center justify-between">
        <span>{label}</span>
        <strong className="text-[1rem]">{value}%</strong>
      </div>
      <progress
        className="dashboard-stat-progress block h-2 w-full appearance-none overflow-hidden rounded-full border-0"
        aria-label={label}
        max={100}
        value={value}
        style={{ '--stat-color': color }}
      />
    </div>
  );
}

function GotchiCareActions({ activeActionType, onPlayAction }) {
  const announcement = CARE_ACTIONS.find(
    (action) => action.type === activeActionType,
  )?.message;

  return (
    <div className="flex justify-center gap-[clamp(1rem,5vw,2rem)] pb-1">
      {CARE_ACTIONS.map(({ type, label }) => (
        <Button
          variant="round"
          className="dashboard-care-button"
          key={type}
          aria-controls={SCENE_ID}
          data-highlighted={activeActionType === type || undefined}
          onClick={() => onPlayAction(type)}
        >
          {label}
        </Button>
      ))}
      <p className="sr-only" role="status" aria-atomic="true">
        {announcement || ''}
      </p>
    </div>
  );
}
