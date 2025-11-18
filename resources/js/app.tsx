import '../css/app.css';

import React, { useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp, theme } from 'antd';
import { useAuthStore } from './stores/authStore';
import { useSettingsStore, FontSize } from './stores/settingsStore';

// Ant Design Locales
import esES from 'antd/locale/es_ES';
import enUS from 'antd/locale/en_US';

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
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';

// Ticket Pages
import TicketList from './pages/tickets/TicketList';
import TicketCreate from './pages/tickets/TicketCreate';
import TicketView from './pages/tickets/TicketView';
import TicketEdit from './pages/tickets/TicketEdit';

// Admin Pages
import Users from './pages/admin/Users';
import Categories from './pages/admin/Categories';
import ResponseTemplates from './pages/admin/ResponseTemplates';
import Slas from './pages/admin/Slas';
import AdminSettings from './pages/admin/Settings';

// Additional Pages
import AssignedTickets from './pages/AssignedTickets';
import KnowledgeBase from './pages/KnowledgeBase';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';

// Font size mapping
const fontSizeMap: Record<FontSize, number> = {
  small: 12,
  medium: 14,
  large: 16,
  xlarge: 18,
};

const appName = import.meta.env.VITE_APP_NAME || 'Support Ticket System';

// Error Pages
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
        <Route path="reports" element={<Reports />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
        <Route path="assigned" element={<AssignedTickets />} />
        <Route path="knowledge-base" element={<KnowledgeBase />} />

        {/* Ticket Routes */}
        <Route path="tickets">
          <Route index element={<TicketList />} />
          <Route path="list" element={<TicketList />} />
          <Route path="create" element={<TicketCreate />} />
          <Route path=":id" element={<TicketView />} />
          <Route path=":id/edit" element={<TicketEdit />} />
        </Route>

        {/* Admin Routes */}
        <Route path="admin">
          <Route
            path="users"
            element={
              <ProtectedRoute roles={['admin']}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="categories"
            element={
              <ProtectedRoute roles={['admin']}>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="response-templates"
            element={
              <ProtectedRoute roles={['admin', 'agent']}>
                <ResponseTemplates />
              </ProtectedRoute>
            }
          />
          <Route
            path="slas"
            element={
              <ProtectedRoute roles={['admin']}>
                <Slas />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminSettings />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>

      {/* Error Pages */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Root App with Providers
const App: React.FC = () => {
  const {
    effectiveTheme,
    language,
    fontSize,
    highContrast,
    reducedMotion,
    updateEffectiveTheme,
  } = useSettingsStore();

  // Listen to system theme preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      updateEffectiveTheme();
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [updateEffectiveTheme]);

  // Apply global CSS for font size and reduced motion
  useEffect(() => {
    const baseFontSize = fontSizeMap[fontSize];
    document.documentElement.style.setProperty('--app-font-size', `${baseFontSize}px`);
    document.documentElement.style.fontSize = `${baseFontSize}px`;

    // Apply reduced motion
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }

    // Apply high contrast
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [fontSize, reducedMotion, highContrast]);

  // Select locale based on language setting
  const locale = language === 'es' ? esES : enUS;

  // Build theme configuration based on settings
  const themeConfig = useMemo(() => {
    const baseFontSize = fontSizeMap[fontSize];
    const isDark = effectiveTheme === 'dark';

    return {
      algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      token: {
        colorPrimary: '#1890ff',
        borderRadius: 6,
        fontSize: baseFontSize,
        // High contrast adjustments
        ...(highContrast && {
          colorText: isDark ? '#ffffff' : '#000000',
          colorTextSecondary: isDark ? '#d9d9d9' : '#262626',
          colorBorder: isDark ? '#595959' : '#434343',
        }),
      },
      components: {
        Layout: {
          siderBg: isDark ? '#000000' : '#001529',
          headerBg: isDark ? '#141414' : '#ffffff',
        },
        Menu: {
          darkItemBg: isDark ? '#000000' : '#001529',
        },
      },
    };
  }, [effectiveTheme, fontSize, highContrast]);

  return (
    <ConfigProvider theme={themeConfig} locale={locale}>
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
