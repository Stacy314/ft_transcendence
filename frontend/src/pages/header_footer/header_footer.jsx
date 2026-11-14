import { Outlet, Link } from 'react-router-dom';
import './style.css';
import logo from '../../assets/transcendochi-logo.svg';
import { useCurrentUser } from '../../hooks/useMe';
import { useLogout } from '../../hooks/useAuthActions';
import { getApiError } from '../../services/api';

export default function HeaderFooter() {

  const { isLoggedIn } = useCurrentUser();
  const logout = useLogout();

  return (
    <div className="site-layout">
      <header className="site-header">
        <Link to="/" className="site-logo" aria-label="Transcengochi – Home">
          <img src={logo} alt="Transcengochi" width="390" height="76" />
        </Link>
        {isLoggedIn && (
          <nav className="site-account-nav" aria-label="Account">
            <Link className="site-profile" to="/profile">Profile</Link>
            <button className="site-logout" type="button" disabled={logout.isPending} onClick={() => logout.mutate()}>Logout</button>
          </nav>
        )}
      </header>
      {logout.isError && <p className="site-logout-error" role="alert">{getApiError(logout.error).message}</p>}

      <div className="site-content">
        <Outlet />
      </div>

      <footer className="site-footer">
        <span>© Transcengotchi</span>
        <nav aria-label="Legal">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </nav>
      </footer>
    </div>
  );
}
