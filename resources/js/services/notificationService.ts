import api, { getErrorMessage } from './api';
import { Notification, PaginatedResponse } from '../types';

// Filter parameters for notification queries
export interface NotificationFilters {
  page?: number;
  per_page?: number;
  unread_only?: boolean;
  type?: string;
}

// Notification service functions
const notificationService = {
  /**
   * Get paginated list of notifications
   */
  async getNotifications(filters: NotificationFilters = {}): Promise<PaginatedResponse<Notification>> {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const response = await api.get(`/notifications?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get unread notifications count
   */
  async getUnreadCount(): Promise<number> {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data.data?.count || response.data.count || 0;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get recent notifications
   */
  async getRecentNotifications(limit: number = 5): Promise<Notification[]> {
    try {
      const response = await api.get(`/notifications/recent?limit=${limit}`);
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Mark a single notification as read
   */
  async markAsRead(id: string): Promise<void> {
    try {
      await api.patch(`/notifications/${id}/read`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Mark a single notification as unread
   */
  async markAsUnread(id: string): Promise<void> {
    try {
      await api.patch(`/notifications/${id}/unread`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    try {
      await api.post('/notifications/mark-all-read');
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Delete a notification
   */
  async deleteNotification(id: string): Promise<void> {
    try {
      await api.delete(`/notifications/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Delete all read notifications
   */
  async deleteAllRead(): Promise<void> {
    try {
      await api.delete('/notifications/delete-read');
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get notification preferences
   */
  async getPreferences(): Promise<{
    email_notifications: boolean;
    ticket_created: boolean;
    ticket_assigned: boolean;
    ticket_updated: boolean;
    ticket_resolved: boolean;
    comment_added: boolean;
  }> {
    try {
      const response = await api.get('/notifications/preferences');
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences: {
    email_notifications?: boolean;
    ticket_created?: boolean;
    ticket_assigned?: boolean;
    ticket_updated?: boolean;
    ticket_resolved?: boolean;
    comment_added?: boolean;
  }): Promise<void> {
    try {
      await api.put('/notifications/preferences', preferences);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

export default notificationService;
