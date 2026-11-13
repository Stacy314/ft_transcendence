import { Outlet, Link } from 'react-router-dom';
import './style.css';

export default function HeaderFooter() {
  return (
    <div className="site-layout">
      <header className="site-header">
        <Link to="/">Logo</Link>
      </header>

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
