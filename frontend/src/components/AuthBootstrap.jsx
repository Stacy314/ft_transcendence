import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useMe, switchUser } from '../hooks/useMe';
import { PUBLIC_PATHS, setUnauthorizedHandler } from '../services/api';

export default function AuthBootstrap({ children }) {
  const { isPending } = useMe();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    setUnauthorizedHandler(() => {
      switchUser(queryClient, null);
      if (!PUBLIC_PATHS.includes(window.location.pathname)) {
        // remember where the user was, so login can send them back
        navigate('/login', { replace: true, state: { from: location } });
      }
    });
  }, [navigate, location, queryClient]);

  // Wait for the session check to avoid a flash of the signed-out view.
  if (isPending) {
    return (
      <div
        role="status"
        className="flex min-h-screen items-center justify-center"
      >
        <p className="text-lg">Loading…</p>
      </div>
    );
  }

  return children;
}
