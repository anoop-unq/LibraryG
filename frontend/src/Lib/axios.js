import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';
// const BASE_URL = 'https://library-management-system-g66t.onrender.com/api';


export const api = axios.create({
  baseURL: BASE_URL,
   withCredentials: true, 
});
