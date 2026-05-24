import axios from 'axios';

const client = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Add interceptor to handle Cloudflare Access session expiration
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we receive a 401 Unauthorized, it indicates the Cloudflare Access session has expired
    if (error.response && error.response.status === 401) {
      // Redirect the top-level window to a non-cached path to trigger Cloudflare Access login flow.
      // We use '/login' because it bypasses the service worker caching in Vite PWA.
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
