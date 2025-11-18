import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const { response } = error;

    if (response) {
      switch (response.status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          localStorage.removeItem('auth_token');

          // Only redirect if not already on auth pages
          if (!window.location.pathname.startsWith('/auth')) {
            window.location.href = '/auth/login';
          }
          break;

        case 403:
          // Forbidden - user doesn't have permission
          console.error('Access forbidden:', response.data);
          break;

        case 404:
          // Not found
          console.error('Resource not found:', response.data);
          break;

        case 422:
          // Validation error - will be handled by the calling code
          break;

        case 500:
          // Server error
          console.error('Server error:', response.data);
          break;

        default:
          console.error('API error:', response.data);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error - no response received');
    } else {
      console.error('Request error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Helper function to handle API errors
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;

    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }

    if (axiosError.response?.data?.errors) {
      const errors = axiosError.response.data.errors;
      const firstError = Object.values(errors)[0];
      if (Array.isArray(firstError) && firstError.length > 0) {
        return firstError[0];
      }
    }

    if (axiosError.message) {
      return axiosError.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

// Helper function to get validation errors
export const getValidationErrors = (error: unknown): Record<string, string[]> => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ errors?: Record<string, string[]> }>;
    return axiosError.response?.data?.errors || {};
  }
  return {};
};

export default api;
