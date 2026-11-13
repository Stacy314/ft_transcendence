import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useCurrentUser } from './hooks/useMe';
import AuthBootstrap from './components/AuthBootstrap';
import ProtectedRoute from './components/ProtectedRoute';
import HeaderFooter from './pages/header_footer/header_footer.jsx';
import Login from './pages/login/login.jsx';
import Dashboard from './pages/dashboard/dashboard.jsx';
import GotchiSelection from './pages/gotchi_selection/gotchi_selection.jsx';
import ForgotPassword from './pages/forgot_password/forgot_password.jsx';
import Profile from './pages/profile/profile.jsx';

function NotFound() {
  return (
    <main>
      <h1>404 - Site not found</h1>
      <p>The called site does not exist.</p>
      <Link to="/">Back to Login</Link>
    </main>
  );
}

// "/" has no page of its own: send the user where they belong
function HomeRedirect() {
  const { isLoggedIn } = useCurrentUser();
  return <Navigate to={isLoggedIn ? '/dashboard' : '/login'} replace />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthBootstrap>
        <Routes>
          <Route element={<HeaderFooter />}>
            <Route path="/" element={<HomeRedirect />}/>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Login initialMode="register" />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/gotchi-selection" element={<GotchiSelection />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthBootstrap>
    </BrowserRouter>
  );
}
