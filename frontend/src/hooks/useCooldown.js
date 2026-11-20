import { useEffect, useState } from 'react';

function secondsLeft(lastAt, cooldownSeconds) {
  if (!lastAt || !cooldownSeconds) return 0;
  const elapsed = (Date.now() - new Date(lastAt).getTime()) / 1000;
  return Math.max(0, Math.ceil(cooldownSeconds - elapsed));
}

// Ticks down to 0 once per second so a button can show/disable itself while
// its action is on cooldown, surviving a page reload since it's derived from
// the server timestamp rather than client-side state. The remaining value is
// computed fresh on every render; `tick` only exists to force one each second.
export function useCooldown(lastAt, cooldownSeconds) {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!lastAt) return;
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [lastAt]);

  return secondsLeft(lastAt, cooldownSeconds);
}
