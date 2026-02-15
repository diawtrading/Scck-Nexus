import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Services
export const authService = {
  login: (data: any) => api.post('/auth/login', data),
  demoLogin: (data: any) => api.post('/auth/demo-login', data),
  verify: () => api.get('/auth/verify'),
  register: (data: any) => api.post('/auth/register', data)
};

export const producersService = {
  getAll: () => api.get('/producers'),
  getById: (id: string) => api.get(`/producers/${id}`),
  create: (data: any) => api.post('/producers', data),
  update: (id: string, data: any) => api.put(`/producers/${id}`, data),
  delete: (id: string) => api.delete(`/producers/${id}`),
  getStats: () => api.get('/producers/stats/overview')
};

export const collectionsService = {
  getAll: () => api.get('/collections'),
  create: (data: any) => api.post('/collections', data),
  update: (id: string, data: any) => api.put(`/collections/${id}`, data),
  delete: (id: string) => api.delete(`/collections/${id}`),
  getStats: () => api.get('/collections/stats/summary')
};

export const financeService = {
  getTransactions: () => api.get('/finance/transactions'),
  createTransaction: (data: any) => api.post('/finance/transactions', data),
  getReport: () => api.get('/finance/report')
};

export const inventoryService = {
  getAll: () => api.get('/inventory'),
  create: (data: any) => api.post('/inventory', data),
  update: (id: string, data: any) => api.put(`/inventory/${id}`, data),
  delete: (id: string) => api.delete(`/inventory/${id}`),
  getAlerts: () => api.get('/inventory/alerts/low-stock')
};

export const employeesService = {
  getAll: () => api.get('/employees'),
  create: (data: any) => api.post('/employees', data),
  getPayroll: () => api.get('/employees/payroll/summary')
};

export const customersService = {
  getAll: () => api.get('/customers'),
  create: (data: any) => api.post('/customers', data),
  getStats: () => api.get('/customers/stats/overview')
};

export const suppliersService = {
  getAll: () => api.get('/suppliers'),
  create: (data: any) => api.post('/suppliers', data),
  getStats: () => api.get('/suppliers/stats/overview')
};

export const projectsService = {
  getAll: () => api.get('/projects'),
  create: (data: any) => api.post('/projects', data),
  updateProgress: (id: string, data: any) => api.post(`/projects/${id}/progress`, data),
  getStats: () => api.get('/projects/stats/overview')
};

export const dashboardService = {
  getKPIs: () => api.get('/dashboard/kpis'),
  getRevenueTrend: () => api.get('/dashboard/revenue-trend'),
  getZonePerformance: () => api.get('/dashboard/zone-performance'),
  getQualityDistribution: () => api.get('/dashboard/quality-distribution'),
  getRecentActivity: () => api.get('/dashboard/recent-activity')
};

export const reportsService = {
  getFinancial: () => api.get('/reports/financial'),
  getProduction: () => api.get('/reports/production'),
  getHR: () => api.get('/reports/hr'),
  getInventory: () => api.get('/reports/inventory'),
  export: (format: string) => api.get(`/reports/export/${format}`, { responseType: 'blob' })
};
