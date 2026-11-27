import './PetActionEffect.css';

const SOAP_BUBBLES = [
  { x: 8, y: 34, size: 0.13, drift: -8, delay: 0 },
  { x: 30, y: 54, size: 0.08, drift: 7, delay: 0.18 },
  { x: 74, y: 42, size: 0.17, drift: -6, delay: 0.3 },
  { x: 90, y: 65, size: 0.11, drift: 8, delay: 0.08 },
  { x: 17, y: 73, size: 0.09, drift: 5, delay: 0.6 },
  { x: 55, y: 30, size: 0.14, drift: -9, delay: 0.48 },
  { x: 82, y: 78, size: 0.08, drift: 5, delay: 0.78 },
  { x: 43, y: 67, size: 0.1, drift: -5, delay: 0.86 },
];

function FoodEffect() {
  return (
    <>
      <div className="pet-food-stream">
        {[0, 2, 1, 0, 1, 2].map((lane, index) => (
          <span
            key={index}
            className="pet-food-pellet"
            style={{
              '--pellet-lane': lane,
              '--pellet-delay': `${0.2 + index * 0.2}s`,
            }}
          />
        ))}
      </div>
      <svg
        className="pet-food-bowl"
        viewBox="0 0 48 30"
        shapeRendering="crispEdges"
      >
        <path d="M5 10H43V19H40V24H36V27H12V24H8V19H5Z" fill="#61969b" />
        <path d="M8 11H40V18H37V22H34V24H14V22H11V18H8Z" fill="#99c4bd" />
        <path d="M7 9H41V14H7Z" fill="#55767a" />
        <path d="M10 8H38V12H10Z" fill="#824b2c" />
        <path
          d="M14 5H20V10H14ZM23 6H29V10H23ZM30 7H35V11H30Z"
          fill="#b57942"
        />
        <path d="M15 5H18V7H15ZM24 6H27V8H24ZM31 7H34V9H31Z" fill="#e0b575" />
        <path d="M8 13H40V16H8Z" fill="#c5e1ce" />
        <path d="M19 20H29V22H19ZM21 18H27V23H21Z" fill="#eff5dc" />
      </svg>
    </>
  );
}

function PlayEffect() {
  return (
    <div className="pet-ball-route">
      <div className="pet-ball-hop">
        <svg
          className="pet-play-ball"
          viewBox="0 0 28 28"
          shapeRendering="crispEdges"
        >
          <path
            d="M8 1H20V3H24V7H26V11H28V17H26V21H24V25H20V27H8V25H4V21H2V17H0V11H2V7H4V3H8Z"
            fill="#79574b"
          />
          <path
            d="M9 3H19V5H23V9H25V12H26V16H24V20H22V23H19V25H9V23H5V19H3V15H2V12H4V8H6V5H9Z"
            fill="#e7b45f"
          />
          <path
            d="M14 3H19V5H23V9H25V12H26V16H21V14H18V11H16V7H14Z"
            fill="#a5ccbd"
          />
          <path
            d="M2 12H7V14H10V17H12V21H14V25H9V23H5V19H3V15H2Z"
            fill="#e39792"
          />
          <path d="M6 7H9V5H12V7H10V9H6Z" fill="#fff3d8" />
        </svg>
      </div>
    </div>
  );
}

function CleanEffect() {
  return (
    <>
      {SOAP_BUBBLES.map((bubble, index) => (
        <span
          key={index}
          className="pet-soap-bubble"
          style={{
            '--bubble-x': `${bubble.x}%`,
            '--bubble-y': `${bubble.y}%`,
            '--bubble-size': `${bubble.size * 100}%`,
            '--bubble-drift': `${bubble.drift}px`,
            '--bubble-delay': `${bubble.delay}s`,
          }}
        />
      ))}
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className={`pet-clean-sparkle pet-clean-sparkle-${index}`}
        />
      ))}
    </>
  );
}

export default function PetActionEffect({ action, onComplete }) {
  if (!['feed', 'play', 'clean'].includes(action)) return null;

  // Child animation events bubble up. Only the wrapper signals that the whole effect finished.
  function finish(event) {
    if (event.target === event.currentTarget) onComplete?.();
  }

  return (
    <div
      className={`pet-action-effect pet-action-effect-${action}`}
      aria-hidden="true"
      onAnimationEnd={finish}
    >
      {action === 'feed' && <FoodEffect />}
      {action === 'play' && <PlayEffect />}
      {action === 'clean' && <CleanEffect />}
    </div>
  );
}
