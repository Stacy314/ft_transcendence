import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HeaderFooter from './pages/header_footer/header_footer.jsx';
import Login from './pages/login/login.jsx';
import Dashboard from './pages/dashboard/dashboard.jsx';
import GotchiSelection from './pages/gotchi_selection/gotchi_selection.jsx';
import ForgotPassword from './pages/forgot_password/forgot_password.jsx';

function NotFound() {
  return (
    <main>
      <h1>404 - Site not found</h1>
      <p>The called site does not exist.</p>
      <Link to="/">Back to Login</Link>
    </main>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HeaderFooter />}>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/gotchi-selection" element={<GotchiSelection />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
