import { useEffect, useState } from 'react';

function secondsUntil(readyAt) {
  if (!readyAt) return 0;
  return Math.max(0, Math.ceil((readyAt - Date.now()) / 1000));
}

// Counts a button's cooldown down to 0; `readyAt` is a deadline on this browser's clock (see services/pets.js).
export function useCooldown(readyAt) {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (secondsUntil(readyAt) === 0) return;

    // Faster than once a second so the number shown is never a stale second.
    const id = setInterval(() => {
      setTick((t) => t + 1);
      if (secondsUntil(readyAt) === 0) clearInterval(id);
    }, 250);
    return () => clearInterval(id);
  }, [readyAt]);

  return secondsUntil(readyAt);
}
