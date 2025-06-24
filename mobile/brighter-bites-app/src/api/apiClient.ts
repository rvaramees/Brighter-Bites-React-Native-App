import axios from 'axios';

// IMPORTANT: Replace this with your computer's IP address
const API_BASE_URL = 'http://192.168.0.102:3001/api';
// nikku-192.168.1.10
// home-192.168.0.104
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;