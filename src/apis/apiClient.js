import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Add request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('currentUser');
    let token = JSON.parse(user);
    if (token) {
      config.headers.Authorization = `Bearer ${token.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('currentUser');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
