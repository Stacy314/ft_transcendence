import { Link, Outlet } from 'react-router-dom';
import logo from '../../assets/transcendochi-logo.svg';
import Button from '../../components/ui/Button.jsx';
import { useLogout } from '../../hooks/useAuthActions';
import { useCurrentUser } from '../../hooks/useMe';
import { getApiError } from '../../services/api';

export default function HeaderFooter() {
  const { isLoggedIn } = useCurrentUser();
  const logout = useLogout();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex w-full flex-wrap items-center justify-between gap-4 bg-(--panel-background) px-8 py-4">
        <Link to="/" className="max-w-full" aria-label="Transcengochi – Home">
          <img
            className="block h-auto w-[300px] max-w-full"
            src={logo}
            alt="Transcengochi"
            width="390"
            height="76"
          />
        </Link>
        {isLoggedIn && (
          <nav
            className="flex flex-wrap items-center gap-3"
            aria-label="Account"
          >
            <Link className="ui-button-secondary no-underline" to="/profile">
              Profile
            </Link>
            <Button
              variant="secondary"
              busy={logout.isPending}
              onClick={() => logout.mutate()}
            >
              Logout
            </Button>
          </nav>
        )}
      </header>
      {logout.isError && (
        <p className="m-0 px-8 py-3 text-[#842e22]" role="alert">
          {getApiError(logout.error).message}
        </p>
      )}

      <div className="grid w-full flex-1 place-items-center">
        <Outlet />
      </div>

      <footer className="flex items-center justify-between gap-4 bg-(--panel-background) px-8 py-4">
        <span>© Transcengotchi</span>
        <nav className="flex gap-4" aria-label="Legal">
          <Link to="/privacy" className="underline">
            Privacy Policy
          </Link>
          <Link to="/terms" className="underline">
            Terms of Service
          </Link>
        </nav>
      </footer>
    </div>
  );
}
