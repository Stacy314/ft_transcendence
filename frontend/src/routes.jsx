import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login/login.jsx';
import Dashboard from './pages/dashboard/dashboard.jsx';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}