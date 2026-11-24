import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useMe, switchUser } from '../hooks/useMe';
import { PUBLIC_PATHS, setUnauthorizedHandler } from '../services/api';

// Wraps the routes. On app start it:
//   1. asks the backend who is logged in (useMe), showing a loader meanwhile,
//      so pages never flash "logged out" for a logged-in user;
//   2. tells the API client how to react to an expired session (401):
//      forget the user and go to /login without reloading the page.
// Must be rendered inside the router (it uses useNavigate).
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
