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

      <footer>© Transcengotchi</footer>
    </div>
  );
}
