import axios from 'axios';

// On crée une instance personnalisée d'axios
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost', 
});

// Intercepteur : Il ajoute AUTOMATIQUEMENT le token à chaque requête
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Attention aux backticks (`) et à l'orthographe de Bearer !
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;