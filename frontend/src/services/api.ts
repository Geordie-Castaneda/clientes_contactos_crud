import axios from "axios";

const API_URL = "http://localhost:5245/api"; // Cambia el puerto si es necesario

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const clientesService = {
  // CRUD Clientes
  getAll: () => api.get("/clientes"),
  getById: (id: number) => api.get(`/clientes/${id}`),
  create: (cliente: any) => api.post("/clientes", cliente),
  update: (id: number, cliente: any) => api.put(`/clientes/${id}`, cliente),
  delete: (id: number) => api.delete(`/clientes/${id}`),

  // JWT Endpoints
  getToken: () => api.get("/auth/token"),
  validateToken: (token: string) => api.post("/auth/validate", { token }),
};

export default api;
