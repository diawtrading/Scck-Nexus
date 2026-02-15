import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// API service functions
export const authService = {
  login: (data) => api.post('/auth/login', data),
  demoLogin: (data) => api.post('/auth/demo-login', data),
  verify: () => api.get('/auth/verify'),
  register: (data) => api.post('/auth/register', data)
}

export const producersService = {
  getAll: () => api.get('/producers'),
  getById: (id) => api.get(`/producers/${id}`),
  create: (data) => api.post('/producers', data),
  update: (id, data) => api.put(`/producers/${id}`, data),
  delete: (id) => api.delete(`/producers/${id}`),
  getStats: () => api.get('/producers/stats/overview')
}

export const collectionsService = {
  getAll: () => api.get('/collections'),
  create: (data) => api.post('/collections', data),
  update: (id, data) => api.put(`/collections/${id}`, data),
  delete: (id) => api.delete(`/collections/${id}`),
  getStats: () => api.get('/collections/stats/summary')
}

export const financeService = {
  getTransactions: () => api.get('/finance/transactions'),
  createTransaction: (data) => api.post('/finance/transactions', data),
  getReport: () => api.get('/finance/report')
}

export const inventoryService = {
  getAll: () => api.get('/inventory'),
  create: (data) => api.post('/inventory', data),
  update: (id, data) => api.put(`/inventory/${id}`, data),
  delete: (id) => api.delete(`/inventory/${id}`),
  getAlerts: () => api.get('/inventory/alerts/low-stock')
}

export const employeesService = {
  getAll: () => api.get('/employees'),
  create: (data) => api.post('/employees', data),
  getPayroll: () => api.get('/employees/payroll/summary')
}

export const customersService = {
  getAll: () => api.get('/customers'),
  create: (data) => api.post('/customers', data),
  getStats: () => api.get('/customers/stats/overview')
}

export const suppliersService = {
  getAll: () => api.get('/suppliers'),
  create: (data) => api.post('/suppliers', data),
  getStats: () => api.get('/suppliers/stats/overview')
}

export const projectsService = {
  getAll: () => api.get('/projects'),
  create: (data) => api.post('/projects', data),
  updateProgress: (id, data) => api.post(`/projects/${id}/progress`, data),
  getStats: () => api.get('/projects/stats/overview')
}

export const dashboardService = {
  getKPIs: () => api.get('/dashboard/kpis'),
  getRevenueTrend: () => api.get('/dashboard/revenue-trend'),
  getZonePerformance: () => api.get('/dashboard/zone-performance'),
  getQualityDistribution: () => api.get('/dashboard/quality-distribution'),
  getRecentActivity: () => api.get('/dashboard/recent-activity')
}

export const reportsService = {
  getFinancial: () => api.get('/reports/financial'),
  getProduction: () => api.get('/reports/production'),
  getHR: () => api.get('/reports/hr'),
  getInventory: () => api.get('/reports/inventory'),
  export: (format) => api.get(`/reports/export/${format}`, { responseType: 'blob' })
}
