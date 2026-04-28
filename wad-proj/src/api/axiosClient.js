import axios from 'axios';

// Using actual local backend as discussed
const axiosClient = axios.create({
  baseURL: 'http://localhost:5000',
});

// Interceptor to attach JWT
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
