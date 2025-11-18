import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    fetchUser,
    updateProfile,
    changePassword,
    uploadPhoto,
    forgotPassword,
    resetPassword,
    clearAuth,
  } = useAuthStore();

  const navigate = useNavigate();

  // Fetch user on mount if token exists but user is null
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken && !user && !isLoading) {
      fetchUser().catch(() => {
        clearAuth();
      });
    }
  }, []);

  // Helper function to check if user has a specific role
  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  // Helper function to check if user is admin
  const isAdmin = (): boolean => {
    return hasRole('admin');
  };

  // Helper function to check if user is agent
  const isAgent = (): boolean => {
    return hasRole('agent');
  };

  // Helper function to check if user is regular user
  const isUser = (): boolean => {
    return hasRole('user');
  };

  // Login and redirect
  const loginWithRedirect = async (
    credentials: { email: string; password: string; remember?: boolean },
    redirectTo: string = '/dashboard'
  ) => {
    await login(credentials);
    navigate(redirectTo);
  };

  // Logout and redirect
  const logoutWithRedirect = async (redirectTo: string = '/auth/login') => {
    await logout();
    navigate(redirectTo);
  };

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,

    // Actions
    login,
    register,
    logout,
    fetchUser,
    updateProfile,
    changePassword,
    uploadPhoto,
    forgotPassword,
    resetPassword,
    clearAuth,

    // Helpers
    hasRole,
    isAdmin,
    isAgent,
    isUser,
    loginWithRedirect,
    logoutWithRedirect,
  };
};

export default useAuth;
