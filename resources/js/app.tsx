import '../css/app.css';

import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp, theme } from 'antd';
import { useAuthStore } from './stores/authStore';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Protected Pages
import Profile from './pages/Profile';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';

const appName = import.meta.env.VITE_APP_NAME || 'Support Ticket System';

// Placeholder components for routes that will be implemented later
const Dashboard: React.FC = () => (
  <div>
    <h1>Dashboard</h1>
    <p>Welcome to the Support Ticket System</p>
  </div>
);

const TicketList: React.FC = () => (
  <div>
    <h1>All Tickets</h1>
    <p>Ticket list will be implemented here</p>
  </div>
);

const CreateTicket: React.FC = () => (
  <div>
    <h1>Create Ticket</h1>
    <p>Create ticket form will be implemented here</p>
  </div>
);

const AssignedTickets: React.FC = () => (
  <div>
    <h1>Assigned to Me</h1>
    <p>Assigned tickets will be shown here</p>
  </div>
);

const NotFound: React.FC = () => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
  </div>
);

const Unauthorized: React.FC = () => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <h1>403 - Unauthorized</h1>
    <p>You don't have permission to access this page.</p>
  </div>
);

// Main App Component
const MainApp: React.FC = () => {
  const { fetchUser, isAuthenticated, token } = useAuthStore();

  // Fetch user data on app mount if token exists
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken && !isAuthenticated) {
      fetchUser().catch(() => {
        // Token is invalid, clear it
        localStorage.removeItem('auth_token');
      });
    }
  }, []);

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />

        {/* Ticket Routes */}
        <Route path="tickets">
          <Route path="list" element={<TicketList />} />
          <Route path="create" element={<CreateTicket />} />
        </Route>

        {/* Agent/Admin Routes */}
        <Route
          path="assigned"
          element={
            <ProtectedRoute roles={['admin', 'agent']}>
              <AssignedTickets />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="admin">
          <Route
            path="users"
            element={
              <ProtectedRoute roles={['admin']}>
                <div><h1>User Management</h1></div>
              </ProtectedRoute>
            }
          />
          <Route
            path="categories"
            element={
              <ProtectedRoute roles={['admin']}>
                <div><h1>Category Management</h1></div>
              </ProtectedRoute>
            }
          />
          <Route
            path="departments"
            element={
              <ProtectedRoute roles={['admin']}>
                <div><h1>Department Management</h1></div>
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute roles={['admin']}>
                <div><h1>System Settings</h1></div>
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Knowledge Base */}
        <Route
          path="knowledge-base"
          element={<div><h1>Knowledge Base</h1></div>}
        />

        {/* Settings */}
        <Route
          path="settings"
          element={<div><h1>User Settings</h1></div>}
        />

        {/* Notifications */}
        <Route
          path="notifications"
          element={<div><h1>Notifications</h1></div>}
        />
      </Route>

      {/* Error Pages */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Root App with Providers
const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
        components: {
          Layout: {
            siderBg: '#001529',
            headerBg: '#ffffff',
          },
          Menu: {
            darkItemBg: '#001529',
          },
        },
      }}
    >
      <AntApp>
        <BrowserRouter>
          <MainApp />
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
};

// Mount the application
const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

export default App;
