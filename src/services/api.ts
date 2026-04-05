import axios from 'axios';

// URL base de tu API backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Crear instancia de axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de Autenticación
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  logout: async () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Servicios de Locales
export const localesService = {
  getAll: async () => {
    const response = await api.get('/locales');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/locales/${id}`);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await api.post('/locales', data);
    return response.data;
  },
  
  update: async (id: string, data: any) => {
    const response = await api.put(`/locales/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/locales/${id}`);
    return response.data;
  },
};

// Servicios de Empleados
export const empleadosService = {
  getAll: async () => {
    const response = await api.get('/empleados');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/empleados/${id}`);
    return response.data;
  },
  
  getByLocal: async (localId: string) => {
    const response = await api.get(`/empleados/local/${localId}`);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await api.post('/empleados', data);
    return response.data;
  },
  
  update: async (id: string, data: any) => {
    const response = await api.put(`/empleados/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/empleados/${id}`);
    return response.data;
  },
};

// Servicios de Ventas
export const ventasService = {
  getAll: async (params?: any) => {
    const response = await api.get('/ventas', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/ventas/${id}`);
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await api.post('/ventas', data);
    return response.data;
  },
  
  getReporte: async (fechaInicio: string, fechaFin: string) => {
    const response = await api.get('/ventas/reporte', {
      params: { fechaInicio, fechaFin },
    });
    return response.data;
  },
};

// Servicios de Inventario
export const inventarioService = {
  getAll: async () => {
    const response = await api.get('/inventario');
    return response.data;
  },
  
  getByLocal: async (localId: string) => {
    const response = await api.get(`/inventario/local/${localId}`);
    return response.data;
  },
  
  createMovimiento: async (data: any) => {
    const response = await api.post('/inventario/movimiento', data);
    return response.data;
  },
  
  getMovimientos: async (params?: any) => {
    const response = await api.get('/inventario/movimientos', { params });
    return response.data;
  },
  
  getStockBajo: async () => {
    const response = await api.get('/inventario/stock-bajo');
    return response.data;
  },
};