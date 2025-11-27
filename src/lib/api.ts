/**
 * API Client for ServiceM8 Portal Backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  }

  // Auth methods
  async register(data: {
    email?: string;
    phone?: string;
    password: string;
    firstName?: string;
    lastName?: string;
    address?: string;
  }) {
    const response = await this.request<{
      success: boolean;
      data: { token: string; customer: any };
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success && response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('customer', JSON.stringify(response.data.customer));
    }

    return response;
  }

  async login(credentials: { email?: string; phone?: string; password: string }) {
    const data = await this.request<{
      success: boolean;
      data: { token: string; customer: any };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (data.success && data.data.token) {
      localStorage.setItem('auth_token', data.data.token);
      localStorage.setItem('customer', JSON.stringify(data.data.customer));
    }

    return data;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('customer');
    }
  }

  async getMe() {
    return this.request<{ success: boolean; data: any }>('/auth/me');
  }

  // Booking methods
  async getBookings() {
    return this.request<{ success: boolean; data: any[]; cached?: boolean }>(
      '/bookings'
    );
  }

  async getBookingById(id: string) {
    return this.request<{ success: boolean; data: any }>(`/bookings/${id}`);
  }

  // Job methods
  async createJob(data: {
    job_address: string;
    job_description: string;
    scheduled_date?: string;
    status?: string;
  }) {
    return this.request<{ success: boolean; data: any }>('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateJob(id: string, data: {
    job_address?: string;
    job_description?: string;
    scheduled_date?: string;
    status?: string;
  }) {
    return this.request<{ success: boolean; data: any }>(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteJob(id: string) {
    return this.request<{ success: boolean; message: string }>(`/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  // Message methods
  async getMessages(jobId: string) {
    return this.request<{ success: boolean; data: any[] }>(
      `/messages/${jobId}`
    );
  }

  async sendMessage(jobId: string, message: string) {
    return this.request<{ success: boolean; data: any }>(`/messages/${jobId}`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request<{ success: boolean; message: string }>('/health');
  }
}

export const apiClient = new APIClient(API_BASE_URL);

