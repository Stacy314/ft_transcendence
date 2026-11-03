import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './routes.jsx';
import './global_styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);
