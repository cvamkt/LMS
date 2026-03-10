import axios from 'axios';

// https://learning-management-system-b1g5.onrender.com
// http://localhost:5000/api/v1
const BASE_URL = "http://localhost:5000/api/v1";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Ensures cookies are sent with cross-origin requests
});

export default axiosInstance;
