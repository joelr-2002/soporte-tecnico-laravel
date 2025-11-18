import api, { getErrorMessage } from './api';
import { Ticket, TicketFormData, PaginatedResponse, DashboardStats } from '../types';

// Filter parameters for ticket queries
export interface TicketFilters {
  page?: number;
  per_page?: number;
  status?: string;
  priority?: string;
  category_id?: number;
  assigned_to?: number;
  user_id?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  date_from?: string;
  date_to?: string;
}

// Response types
export interface TicketResponse {
  data: Ticket;
  message?: string;
}

export interface TicketsResponse extends PaginatedResponse<Ticket> {}

export interface StatisticsResponse {
  data: DashboardStats & {
    tickets_by_status: { status: string; count: number }[];
    tickets_by_priority: { priority: string; count: number }[];
    tickets_by_category: { category: string; count: number }[];
    tickets_over_time: { date: string; count: number }[];
    recent_tickets: Ticket[];
    urgent_tickets: Ticket[];
    agent_stats?: {
      assigned_count: number;
      resolved_this_week: number;
      avg_resolution_time: number;
    };
    admin_stats?: {
      agent_performance: {
        agent_id: number;
        agent_name: string;
        assigned: number;
        resolved: number;
        avg_resolution_time: number;
      }[];
      unassigned_count: number;
      total_users: number;
      total_agents: number;
    };
  };
}

// Ticket service functions
const ticketService = {
  /**
   * Get paginated list of tickets with filters
   */
  async getTickets(filters: TicketFilters = {}): Promise<TicketsResponse> {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const response = await api.get(`/tickets?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get a single ticket by ID
   */
  async getTicket(id: number): Promise<Ticket> {
    try {
      const response = await api.get(`/tickets/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Create a new ticket
   */
  async createTicket(data: TicketFormData): Promise<Ticket> {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category_id', String(data.category_id));
      formData.append('priority', data.priority);

      if (data.attachments) {
        data.attachments.forEach((file, index) => {
          formData.append(`attachments[${index}]`, file);
        });
      }

      const response = await api.post('/tickets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Update an existing ticket
   */
  async updateTicket(id: number, data: Partial<TicketFormData> & {
    status?: string;
    assigned_to?: number | null;
    due_date?: string | null;
  }): Promise<Ticket> {
    try {
      const response = await api.put(`/tickets/${id}`, data);
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Delete a ticket
   */
  async deleteTicket(id: number): Promise<void> {
    try {
      await api.delete(`/tickets/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Assign a ticket to an agent
   */
  async assignTicket(id: number, agentId: number | null): Promise<Ticket> {
    try {
      const response = await api.post(`/tickets/${id}/assign`, {
        assigned_to: agentId,
      });
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Change ticket status
   */
  async changeStatus(id: number, status: string): Promise<Ticket> {
    try {
      const response = await api.post(`/tickets/${id}/status`, { status });
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get dashboard statistics
   */
  async getStatistics(): Promise<StatisticsResponse['data']> {
    try {
      const response = await api.get('/tickets/statistics');
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get recent tickets
   */
  async getRecentTickets(limit: number = 5): Promise<Ticket[]> {
    try {
      const response = await api.get(`/tickets/recent?limit=${limit}`);
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get urgent/high priority tickets
   */
  async getUrgentTickets(): Promise<Ticket[]> {
    try {
      const response = await api.get('/tickets/urgent');
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get my assigned tickets (for agents)
   */
  async getMyAssignedTickets(filters: TicketFilters = {}): Promise<TicketsResponse> {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const response = await api.get(`/tickets/my-assigned?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Bulk update tickets
   */
  async bulkUpdate(ticketIds: number[], data: {
    status?: string;
    priority?: string;
    assigned_to?: number | null;
    category_id?: number;
  }): Promise<{ updated: number }> {
    try {
      const response = await api.post('/tickets/bulk-update', {
        ticket_ids: ticketIds,
        ...data,
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get ticket activity log
   */
  async getTicketActivity(id: number): Promise<{
    id: number;
    action: string;
    description: string;
    user: { id: number; name: string };
    created_at: string;
  }[]> {
    try {
      const response = await api.get(`/tickets/${id}/activity`);
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

export default ticketService;
