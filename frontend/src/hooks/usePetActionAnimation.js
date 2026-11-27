import { useCallback, useEffect, useRef, useState } from 'react';

export function usePetActionAnimation() {
  const [activeAction, setActiveAction] = useState(null);
  const nextActionId = useRef(0);

  // A previous animation may finish after another click. Only clear the action whose ID matches.
  const finishAction = useCallback((id) => {
    setActiveAction((current) => (current?.id === id ? null : current));
  }, []);

  const playAction = useCallback((type) => {
    nextActionId.current += 1;
    setActiveAction({ type, id: nextActionId.current });
  }, []);

  useEffect(() => {
    if (!activeAction) return;

    // Also finish when reduced motion disables the CSS animation-end event.
    const timeout = window.setTimeout(
      () => finishAction(activeAction.id),
      3000,
    );
    return () => window.clearTimeout(timeout);
  }, [activeAction, finishAction]);

  return { activeAction, playAction, finishAction };
}
