import axios from 'axios';

// IMPORTANT: Replace this with your computer's IP address
const API_BASE_URL = 'http://192.168.0.104:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;