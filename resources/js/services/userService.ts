import api, { getErrorMessage } from './api';
import { User, PaginatedResponse } from '../types';

// User form data for create
export interface UserCreateData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'admin' | 'agent' | 'user';
  phone?: string;
  department_id?: number;
  is_active?: boolean;
}

// User form data for update
export interface UserUpdateData {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  role?: 'admin' | 'agent' | 'user';
  phone?: string;
  department_id?: number;
  is_active?: boolean;
}

// Filter parameters for user queries
export interface UserFilters {
  page?: number;
  per_page?: number;
  search?: string;
  role?: string;
  is_active?: boolean;
  department_id?: number;
}

// Extended user with ticket counts
export interface UserWithStats extends User {
  tickets_count?: number;
  assigned_tickets_count?: number;
}

// User service functions
const userService = {
  /**
   * Get paginated list of users with filters
   */
  async getUsers(filters: UserFilters = {}): Promise<PaginatedResponse<UserWithStats>> {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const response = await api.get(`/users?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get all agents
   */
  async getAgents(): Promise<User[]> {
    try {
      const response = await api.get('/users/agents');
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get all admins
   */
  async getAdmins(): Promise<User[]> {
    try {
      const response = await api.get('/users/admins');
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get a single user by ID
   */
  async getUser(id: number): Promise<UserWithStats> {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Create a new user
   */
  async createUser(data: UserCreateData): Promise<User> {
    try {
      const response = await api.post('/users', data);
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Update an existing user
   */
  async updateUser(id: number, data: UserUpdateData): Promise<User> {
    try {
      const response = await api.put(`/users/${id}`, data);
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Delete a user
   */
  async deleteUser(id: number): Promise<void> {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Change user role
   */
  async changeRole(id: number, role: 'admin' | 'agent' | 'user'): Promise<User> {
    try {
      const response = await api.patch(`/users/${id}/role`, { role });
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Toggle user active status
   */
  async toggleStatus(id: number): Promise<User> {
    try {
      const response = await api.patch(`/users/${id}/toggle-status`);
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Check if user can be deleted (no tickets)
   */
  async canDelete(id: number): Promise<{ can_delete: boolean; ticket_count: number }> {
    try {
      const response = await api.get(`/users/${id}/can-delete`);
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Reset user password (admin only)
   */
  async resetPassword(id: number, password: string): Promise<void> {
    try {
      await api.patch(`/users/${id}/reset-password`, { password });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get user statistics
   */
  async getUserStats(id: number): Promise<{
    total_tickets: number;
    open_tickets: number;
    resolved_tickets: number;
    avg_resolution_time: number;
  }> {
    try {
      const response = await api.get(`/users/${id}/stats`);
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

export default userService;
