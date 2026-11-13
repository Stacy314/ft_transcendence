import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useMe } from '../hooks/useMe';

export default function ProtectedRoute() {
  const { data: user, isPending, isError, isFetching, refetch } = useMe();
  const location = useLocation();

  if (isPending) return <p role="status">Checking session…</p>;

  if (isError) {
    return (
      <div role="alert">
        <p>Could not verify your session. Please try again.</p>
        <button type="button" disabled={isFetching} onClick={() => refetch()}>
          {isFetching ? 'Checking…' : 'Try again'}
        </button>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  return <Outlet />;
}
