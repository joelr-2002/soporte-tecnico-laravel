import api, { getErrorMessage } from './api';
import { Category, PaginatedResponse } from '../types';

// Category form data for create/update
export interface CategoryFormData {
  name: string;
  description?: string;
  parent_id?: number | null;
  is_active?: boolean;
}

// Filter parameters for category queries
export interface CategoryFilters {
  page?: number;
  per_page?: number;
  search?: string;
  is_active?: boolean;
  parent_id?: number | null;
}

// Extended category with ticket count
export interface CategoryWithStats extends Category {
  tickets_count?: number;
}

// Category service functions
const categoryService = {
  /**
   * Get paginated list of categories with filters
   */
  async getCategories(filters: CategoryFilters = {}): Promise<PaginatedResponse<CategoryWithStats>> {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const response = await api.get(`/categories?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get all categories (without pagination)
   */
  async getAllCategories(): Promise<CategoryWithStats[]> {
    try {
      const response = await api.get('/categories/all');
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get active categories only
   */
  async getActiveCategories(): Promise<Category[]> {
    try {
      const response = await api.get('/categories/active');
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get a single category by ID
   */
  async getCategory(id: number): Promise<CategoryWithStats> {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Create a new category
   */
  async createCategory(data: CategoryFormData): Promise<Category> {
    try {
      const response = await api.post('/categories', data);
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Update an existing category
   */
  async updateCategory(id: number, data: Partial<CategoryFormData>): Promise<Category> {
    try {
      const response = await api.put(`/categories/${id}`, data);
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Delete a category
   */
  async deleteCategory(id: number): Promise<void> {
    try {
      await api.delete(`/categories/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Toggle category active status
   */
  async toggleStatus(id: number): Promise<Category> {
    try {
      const response = await api.patch(`/categories/${id}/toggle-status`);
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get category tree (hierarchical structure)
   */
  async getCategoryTree(): Promise<Category[]> {
    try {
      const response = await api.get('/categories/tree');
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Check if category can be deleted (no tickets)
   */
  async canDelete(id: number): Promise<{ can_delete: boolean; ticket_count: number }> {
    try {
      const response = await api.get(`/categories/${id}/can-delete`);
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

export default categoryService;
