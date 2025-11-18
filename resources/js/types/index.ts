import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

// Inertia types
export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

// User types
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role: 'admin' | 'agent' | 'user';
  department_id: number | null;
  photo_url: string | null;
  phone: string | null;
  is_active: boolean;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

// SLA types
export interface Sla {
  id: number;
  name: string;
  description: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  response_time: number;
  resolution_time: number;
  response_time_hours: number;
  resolution_time_hours: number;
  formatted_response_time: string;
  formatted_resolution_time: string;
  is_active: boolean;
  tickets_count?: number;
  created_at: string;
  updated_at: string;
}

export interface SlaFormData {
  name: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  response_time: number;
  resolution_time: number;
  is_active?: boolean;
}

export interface SlaComplianceStats {
  total_tickets_with_sla: number;
  response: {
    compliant: number;
    breached: number;
    at_risk: number;
    compliance_rate: number;
  };
  resolution: {
    compliant: number;
    breached: number;
    at_risk: number;
    compliance_rate: number;
  };
  by_priority: {
    [key: string]: {
      total: number;
      response_breached: number;
      resolution_breached: number;
      response_compliance_rate: number;
      resolution_compliance_rate: number;
    };
  };
}

// Ticket types
export interface Ticket {
  id: number;
  ticket_number: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed' | 'new' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category_id: number;
  user_id: number;
  assigned_to: number | null;
  department_id: number | null;
  due_date: string | null;
  resolved_at: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
  user?: User;
  assignee?: User;
  assigned_agent?: User;
  category?: Category;
  sla?: Sla;
  comments?: Comment[];
  attachments?: Attachment[];
  // SLA fields
  first_response_at?: string | null;
  sla_response_due_at?: string | null;
  sla_resolution_due_at?: string | null;
  sla_response_breached?: boolean;
  sla_resolution_breached?: boolean;
  response_time_remaining?: number | null;
  resolution_time_remaining?: number | null;
  sla_status?: 'ok' | 'at_risk' | 'breached';
}

export interface TicketFormData {
  title: string;
  description: string;
  category_id: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attachments?: File[];
}

// Comment types
export interface Comment {
  id: number;
  ticket_id: number;
  user_id: number;
  content: string;
  is_internal: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
  attachments?: Attachment[];
}

export interface CommentFormData {
  content: string;
  is_internal?: boolean;
  attachments?: File[];
}

// Category types
export interface Category {
  id: number;
  name: string;
  description: string | null;
  parent_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  parent?: Category;
  children?: Category[];
}

// Attachment types
export interface Attachment {
  id: number;
  attachable_type: string;
  attachable_id: number;
  filename: string;
  original_filename: string;
  mime_type: string;
  size: number;
  path: string;
  url: string;
  created_at: string;
  updated_at: string;
}

// Notification types
export interface Notification {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: {
    title: string;
    message: string;
    ticket_id?: number;
    action_url?: string;
    [key: string]: unknown;
  };
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

// Department types
export interface Department {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateProfileData {
  name: string;
  email: string;
  phone?: string;
  photo?: File;
}

export interface ChangePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

// Dashboard statistics
export interface DashboardStats {
  total_tickets: number;
  open_tickets: number;
  in_progress_tickets: number;
  resolved_tickets: number;
  closed_tickets: number;
  my_tickets?: number;
  assigned_tickets?: number;
  unassigned_tickets?: number;
}

// Menu item type for navigation
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  roles?: string[];
}
