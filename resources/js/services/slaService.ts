import api, { getErrorMessage } from './api';
import { Sla, SlaFormData, SlaComplianceStats, Ticket } from '../types';

// SLA filter parameters
export interface SlaFilters {
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  is_active?: boolean;
}

// At-risk ticket response
export interface AtRiskTicket {
  id: number;
  ticket_number: string;
  title: string;
  priority: string;
  status: string;
  sla_name: string;
  response_time_remaining: number | null;
  resolution_time_remaining: number | null;
  sla_response_due_at: string | null;
  sla_resolution_due_at: string | null;
  assigned_agent: { id: number; name: string } | null;
  created_at: string;
}

// Breached ticket response
export interface BreachedTicket {
  id: number;
  ticket_number: string;
  title: string;
  priority: string;
  status: string;
  sla_name: string;
  sla_response_breached: boolean;
  sla_resolution_breached: boolean;
  first_response_at: string | null;
  resolved_at: string | null;
  sla_response_due_at: string | null;
  sla_resolution_due_at: string | null;
  assigned_agent: { id: number; name: string } | null;
  created_at: string;
}

// SLA service functions
const slaService = {
  /**
   * Get list of SLAs
   */
  async getSlas(filters: SlaFilters = {}): Promise<Sla[]> {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });

      const response = await api.get(`/slas?${params.toString()}`);
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get a single SLA by ID
   */
  async getSla(id: number): Promise<Sla> {
    try {
      const response = await api.get(`/slas/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Create a new SLA
   */
  async createSla(data: SlaFormData): Promise<Sla> {
    try {
      const response = await api.post('/slas', data);
      return response.data.sla || response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Update an existing SLA
   */
  async updateSla(id: number, data: Partial<SlaFormData>): Promise<Sla> {
    try {
      const response = await api.put(`/slas/${id}`, data);
      return response.data.sla || response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Delete an SLA
   */
  async deleteSla(id: number): Promise<void> {
    try {
      await api.delete(`/slas/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get SLA compliance statistics
   */
  async getComplianceStats(dateFrom?: string, dateTo?: string): Promise<SlaComplianceStats> {
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append('date_from', dateFrom);
      if (dateTo) params.append('date_to', dateTo);

      const response = await api.get(`/slas/compliance?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get tickets at risk of breaching SLA
   */
  async getAtRiskTickets(minutes: number = 60): Promise<AtRiskTicket[]> {
    try {
      const response = await api.get(`/slas/at-risk?minutes=${minutes}`);
      return response.data.tickets || [];
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get breached tickets
   */
  async getBreachedTickets(
    type?: 'response' | 'resolution',
    page: number = 1,
    perPage: number = 15
  ): Promise<{
    data: BreachedTicket[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  }> {
    try {
      const params = new URLSearchParams({
        page: String(page),
        per_page: String(perPage),
      });
      if (type) params.append('type', type);

      const response = await api.get(`/slas/breached?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Format minutes to human readable string
   */
  formatMinutes(minutes: number | null): string {
    if (minutes === null) return '-';

    const absMinutes = Math.abs(minutes);
    const sign = minutes < 0 ? '-' : '';

    if (absMinutes < 60) {
      return `${sign}${absMinutes}m`;
    }

    const hours = Math.floor(absMinutes / 60);
    const remainingMinutes = absMinutes % 60;

    if (remainingMinutes === 0) {
      return `${sign}${hours}h`;
    }

    return `${sign}${hours}h ${remainingMinutes}m`;
  },

  /**
   * Get SLA status color
   */
  getSlaStatusColor(status: string): string {
    switch (status) {
      case 'ok':
        return 'green';
      case 'at_risk':
        return 'orange';
      case 'breached':
        return 'red';
      default:
        return 'default';
    }
  },

  /**
   * Get priority color
   */
  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'low':
        return 'blue';
      case 'medium':
        return 'cyan';
      case 'high':
        return 'orange';
      case 'urgent':
        return 'red';
      default:
        return 'default';
    }
  },
};

export default slaService;
