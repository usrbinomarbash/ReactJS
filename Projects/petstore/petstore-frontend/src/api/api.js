import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3388/api'
});

api.interceptors.request.use(request => {
  console.log('Making request to:', request.baseURL + request.url);
  return request;
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

export default api;