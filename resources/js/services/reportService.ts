import api, { getErrorMessage } from './api';

// Report data types
export interface TicketsByPeriodData {
  period: string;
  count: number;
  resolved?: number;
  created?: number;
}

export interface TicketsByStatusData {
  status: string;
  count: number;
  percentage: number;
}

export interface TicketsByPriorityData {
  priority: string;
  count: number;
  percentage: number;
}

export interface TicketsByCategoryData {
  category_id: number;
  category_name: string;
  count: number;
  percentage: number;
}

export interface AgentPerformanceData {
  agent_id: number;
  agent_name: string;
  agent_email: string;
  total_assigned: number;
  total_resolved: number;
  total_pending: number;
  avg_resolution_time_hours: number;
  resolution_rate: number;
  customer_satisfaction?: number;
}

export interface ResolutionTimeData {
  period: string;
  avg_hours: number;
  min_hours: number;
  max_hours: number;
  tickets_resolved: number;
}

export interface ReportFilters {
  start_date?: string;
  end_date?: string;
  group_by?: 'day' | 'week' | 'month' | 'year';
  category_id?: number;
  priority?: string;
  status?: string;
  agent_id?: number;
  department_id?: number;
}

// Report service functions
const reportService = {
  /**
   * Get tickets grouped by time period
   */
  async getTicketsByPeriod(
    startDate: string,
    endDate: string,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): Promise<TicketsByPeriodData[]> {
    try {
      const response = await api.get('/reports/tickets-by-period', {
        params: {
          start_date: startDate,
          end_date: endDate,
          group_by: groupBy,
        },
      });
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get tickets grouped by status
   */
  async getTicketsByStatus(filters: ReportFilters = {}): Promise<TicketsByStatusData[]> {
    try {
      const response = await api.get('/reports/tickets-by-status', {
        params: filters,
      });
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get tickets grouped by priority
   */
  async getTicketsByPriority(filters: ReportFilters = {}): Promise<TicketsByPriorityData[]> {
    try {
      const response = await api.get('/reports/tickets-by-priority', {
        params: filters,
      });
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get tickets grouped by category
   */
  async getTicketsByCategory(filters: ReportFilters = {}): Promise<TicketsByCategoryData[]> {
    try {
      const response = await api.get('/reports/tickets-by-category', {
        params: filters,
      });
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get agent performance metrics
   */
  async getAgentPerformance(filters: ReportFilters = {}): Promise<AgentPerformanceData[]> {
    try {
      const response = await api.get('/reports/agent-performance', {
        params: filters,
      });
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get average resolution time data
   */
  async getAverageResolutionTime(filters: ReportFilters = {}): Promise<ResolutionTimeData[]> {
    try {
      const response = await api.get('/reports/resolution-time', {
        params: filters,
      });
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Export report data to CSV
   */
  async exportToCsv(filters: ReportFilters & {
    report_type: 'tickets' | 'performance' | 'resolution' | 'summary';
  }): Promise<Blob> {
    try {
      const response = await api.get('/reports/export-csv', {
        params: filters,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Download CSV file helper
   */
  downloadCsv(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  /**
   * Get dashboard summary statistics
   */
  async getDashboardSummary(): Promise<{
    total_tickets: number;
    open_tickets: number;
    in_progress_tickets: number;
    resolved_tickets: number;
    closed_tickets: number;
    avg_resolution_time: number;
    tickets_today: number;
    tickets_this_week: number;
    tickets_this_month: number;
  }> {
    try {
      const response = await api.get('/reports/dashboard-summary');
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get SLA compliance report
   */
  async getSlaCompliance(filters: ReportFilters = {}): Promise<{
    total_tickets: number;
    within_sla: number;
    breached_sla: number;
    compliance_rate: number;
    by_priority: {
      priority: string;
      total: number;
      within_sla: number;
      breached: number;
    }[];
  }> {
    try {
      const response = await api.get('/reports/sla-compliance', {
        params: filters,
      });
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get customer satisfaction report
   */
  async getCustomerSatisfaction(filters: ReportFilters = {}): Promise<{
    avg_rating: number;
    total_ratings: number;
    distribution: {
      rating: number;
      count: number;
      percentage: number;
    }[];
  }> {
    try {
      const response = await api.get('/reports/customer-satisfaction', {
        params: filters,
      });
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  /**
   * Get trending issues/categories
   */
  async getTrendingIssues(limit: number = 10): Promise<{
    category_id: number;
    category_name: string;
    ticket_count: number;
    trend: 'up' | 'down' | 'stable';
    change_percentage: number;
  }[]> {
    try {
      const response = await api.get('/reports/trending-issues', {
        params: { limit },
      });
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

export default reportService;
