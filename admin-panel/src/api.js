import axios from 'axios';

// The Live API URL from your README
const BASE_URL = 'http://127.0.0.1:8012'; 
const ADMIN_TOKEN = 'vG7@pQ92!mKz8$rXwLq4321'; // Must match ADMIN_SECRET in Railway

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-Admin-Token': ADMIN_TOKEN,
    'Content-Type': 'application/json'
  }
});

export default api;