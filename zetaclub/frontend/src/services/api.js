import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Device ID para persistência sem login
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = 'dev_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('deviceId', deviceId);
  }
  
  // Adicionar deviceId em todas as requisições GET se necessário
  if (config.method === 'get') {
    config.params = { ...config.params, deviceId };
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      if (!window.location.pathname.includes("/d9a71f2c6e84b5a3")) {
        window.location.href = "/d9a71f2c6e84b5a3";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
