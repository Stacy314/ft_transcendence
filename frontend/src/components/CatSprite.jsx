import { useId } from 'react';

const SPRITE_GROUND_Y = 55;

// Regions use the source PNG's pixel grid; no part is rescaled independently.
const SPRITES = {
  'cat-1': {
    width: 65,
    height: 64,
    groundY: 55,
    head: [{ x: 0, y: 0, width: 65, height: 30 }],
    body: [],
    tail: [{ x: 48, y: 30, width: 8, height: 22 }],
    sleepSymbol: [],
    connectors: [
      { x: 24, y: 28, width: 17, height: 4 },
      { x: 47, y: 45, width: 6, height: 7 },
    ],
    ears: [
      { x: 20, y: 10, width: 9, height: 8 },
      { x: 36, y: 10, width: 8, height: 8 },
    ],
    earConnectors: [
      { x: 20, y: 16, width: 9, height: 3 },
      { x: 36, y: 16, width: 8, height: 3 },
    ],
    eyes: [
      { x: 23, y: 20, width: 4, height: 4 },
      { x: 35, y: 20, width: 4, height: 4 },
    ],
  },
  'cat-2': {
    width: 68,
    height: 64,
    groundY: 48,
    head: [{ d: 'M0 10H26V18H27V19H28V20H29V21H30V30H29V35H30V36H31V37H32V42H0Z' }],
    body: [{ d: 'M26 0H68V30H30V21H29V20H28V19H27V18H26Z' }],
    tail: [],
    sleepSymbol: [{ x: 15, y: 2, width: 5, height: 7 }],
    connectors: [{ x: 30, y: 28, width: 33, height: 4 }],
    ears: [],
    earConnectors: [],
    eyes: [],
  },
};

function Regions({ regions, fill }) {
  return regions.map((region, index) => (
    region.d
      ? <path key={index} {...region} fill={fill} />
      : <rect key={index} {...region} fill={fill} />
  ));
}

export default function CatSprite({ image, species, label, className = '' }) {
  const instanceId = useId().replaceAll(':', '');
  const sourceId = `cat-${instanceId}-source`;
  const baseMaskId = `cat-${instanceId}-base`;
  const headMaskId = `cat-${instanceId}-head`;
  const bodyClipId = `cat-${instanceId}-body`;
  const tailClipId = `cat-${instanceId}-tail`;
  const sleepSymbolClipId = `cat-${instanceId}-sleep-symbol`;
  const connectorClipId = `cat-${instanceId}-connectors`;
  const earConnectorClipId = `cat-${instanceId}-ear-connectors`;
  const eyesClipId = `cat-${instanceId}-eyes`;
  const sprite = SPRITES[species];

  if (!sprite) {
    return <img className={className} src={image} alt={label} data-species={species} />;
  }

  return (
    <svg
      className={`cat-sprite ${className}`.trim()}
      data-species={species}
      width={sprite.width}
      height={sprite.height}
      viewBox={`0 ${sprite.groundY - SPRITE_GROUND_Y} ${sprite.width} ${sprite.height}`}
      role="img"
      aria-label={label}
      focusable="false"
      shapeRendering="crispEdges"
    >
      <defs>
        <image
          id={sourceId}
          href={image}
          width={sprite.width}
          height={sprite.height}
          preserveAspectRatio="none"
        />
        <mask id={baseMaskId} maskUnits="userSpaceOnUse" x="0" y="0" width={sprite.width} height={sprite.height}>
          <rect width={sprite.width} height={sprite.height} fill="white" />
          <Regions regions={[...sprite.head, ...sprite.body, ...sprite.tail, ...sprite.sleepSymbol]} fill="black" />
        </mask>
        <mask id={headMaskId} maskUnits="userSpaceOnUse" x="0" y="0" width={sprite.width} height={sprite.height}>
          <Regions regions={sprite.head} fill="white" />
          <Regions regions={[...sprite.ears, ...sprite.eyes]} fill="black" />
        </mask>
        <clipPath id={bodyClipId} clipPathUnits="userSpaceOnUse">
          <Regions regions={sprite.body} />
        </clipPath>
        <clipPath id={tailClipId} clipPathUnits="userSpaceOnUse">
          <Regions regions={sprite.tail} />
        </clipPath>
        <clipPath id={sleepSymbolClipId} clipPathUnits="userSpaceOnUse">
          <Regions regions={sprite.sleepSymbol} />
        </clipPath>
        <clipPath id={connectorClipId} clipPathUnits="userSpaceOnUse">
          <Regions regions={sprite.connectors} />
        </clipPath>
        <clipPath id={earConnectorClipId} clipPathUnits="userSpaceOnUse">
          <Regions regions={sprite.earConnectors} />
        </clipPath>
        <clipPath id={eyesClipId} clipPathUnits="userSpaceOnUse">
          <Regions regions={sprite.eyes} />
        </clipPath>
        {sprite.ears.map((ear, index) => (
          <clipPath key={index} id={`cat-${instanceId}-ear-${index}`} clipPathUnits="userSpaceOnUse">
            <rect {...ear} />
          </clipPath>
        ))}
      </defs>

      <use href={`#${sourceId}`} mask={`url(#${baseMaskId})`} />
      {/* Original-source overlap strips keep moving joints connected. */}
      <use href={`#${sourceId}`} clipPath={`url(#${connectorClipId})`} />
      {sprite.body.length > 0 && (
        <g className="cat-sprite-part cat-sprite-body">
          <use href={`#${sourceId}`} clipPath={`url(#${bodyClipId})`} />
        </g>
      )}
      {sprite.tail.length > 0 && (
        <g className="cat-sprite-part cat-sprite-tail">
          <use href={`#${sourceId}`} clipPath={`url(#${tailClipId})`} />
        </g>
      )}
      <g className="cat-sprite-part cat-sprite-head">
        <use href={`#${sourceId}`} mask={`url(#${headMaskId})`} />
        <use href={`#${sourceId}`} clipPath={`url(#${earConnectorClipId})`} />
        {sprite.ears.map((ear, index) => (
          <g key={index} className={`cat-sprite-part cat-sprite-ear cat-sprite-ear-${index}`}>
            <use href={`#${sourceId}`} clipPath={`url(#cat-${instanceId}-ear-${index})`} />
          </g>
        ))}
        {sprite.eyes.length > 0 && (
          <>
            <g className="cat-sprite-part cat-sprite-eyes-open" opacity="1">
              <use href={`#${sourceId}`} clipPath={`url(#${eyesClipId})`} />
            </g>
            <g className="cat-sprite-part cat-sprite-eyes-closed" opacity="0">
              <Regions regions={sprite.eyes} fill="#e8e8e8" />
              {sprite.eyes.map((eye, index) => (
                <rect key={index} x={eye.x} y={eye.y + 3} width={eye.width} height="1" fill="#3a5a8d" />
              ))}
            </g>
          </>
        )}
      </g>
      {sprite.sleepSymbol.length > 0 && (
        <g className="cat-sprite-part cat-sprite-sleep-symbol">
          <use href={`#${sourceId}`} clipPath={`url(#${sleepSymbolClipId})`} />
        </g>
      )}
    </svg>
  );
}
