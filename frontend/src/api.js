import axios from 'axios';

const api = axios.create({
  // Aapka Backend URL (FastAPI wala port)
  baseURL: 'http://localhost:8000', 
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;