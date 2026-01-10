/**
 * API Service - Handles all backend API calls
 */

const API_BASE_URL = 'http://localhost:5001/api';

interface ApiOptions {
  token?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, any>;
}

async function apiCall(endpoint: string, options: ApiOptions = {}) {
  const { token, method = 'GET', body } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `API Error: ${response.status}`);
  }

  return await response.json();
}

// Auth APIs
export const authAPI = {
  login: (username: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: { username, password },
    }),

  getCurrentUser: (token: string) =>
    apiCall('/auth/me', { token }),
};

// Employee APIs
export const employeeAPI = {
  getAll: (token: string) =>
    apiCall('/employees', { token }),

  getById: (id: number, token: string) =>
    apiCall(`/employees/${id}`, { token }),

  create: (data: Record<string, any>, token: string) =>
    apiCall('/employees', {
      method: 'POST',
      token,
      body: data,
    }),

  update: (id: number, data: Record<string, any>, token: string) =>
    apiCall(`/employees/${id}`, {
      method: 'PUT',
      token,
      body: data,
    }),

  delete: (id: number, token: string) =>
    apiCall(`/employees/${id}`, {
      method: 'DELETE',
      token,
    }),
};

// Attendance APIs
export const attendanceAPI = {
  getAll: (token: string, filters?: { employeeId?: number; date?: string }) => {
    let endpoint = '/attendance';
    if (filters) {
      const params = new URLSearchParams();
      if (filters.employeeId) params.append('employeeId', filters.employeeId.toString());
      if (filters.date) params.append('date', filters.date);
      if (params.toString()) endpoint += `?${params.toString()}`;
    }
    return apiCall(endpoint, { token });
  },

  create: (data: Record<string, any>, token: string) =>
    apiCall('/attendance', {
      method: 'POST',
      token,
      body: data,
    }),

  bulkImport: (records: Array<Record<string, any>>, token: string) =>
    apiCall('/attendance/bulk-import', {
      method: 'POST',
      token,
      body: { records },
    }),
};

export default {
  authAPI,
  employeeAPI,
  attendanceAPI,
};
