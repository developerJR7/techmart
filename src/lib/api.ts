import axios from 'axios';
import { getAccessToken, setAccessToken } from './auth-token';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Envia o cookie httpOnly do refresh token e o cookie de CSRF em toda
  // chamada (necessário porque frontend e backend ficam em origens
  // diferentes).
  withCredentials: true,
  withXSRFToken: true,
});

// Anexa o access token (em memória) no header Authorization.
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface RefreshResult {
  accessToken: string;
  user: unknown;
}

let refreshPromise: Promise<RefreshResult | null> | null = null;

/**
 * Troca o cookie httpOnly de refresh token por um novo access token.
 * Deduplica chamadas concorrentes (várias requisições 401 ao mesmo tempo
 * disparam uma única troca de token).
 */
export async function refreshSession(): Promise<RefreshResult | null> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${API_URL}/auth/refresh`, null, {
        withCredentials: true,
        withXSRFToken: true,
      })
      .then(({ data }) => {
        setAccessToken(data.accessToken);
        return data as RefreshResult;
      })
      .catch(() => {
        setAccessToken(null);
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

// Trata 401: tenta renovar a sessão via cookie e repete a requisição original.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/refresh');

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint &&
      typeof window !== 'undefined'
    ) {
      originalRequest._retry = true;

      const refreshed = await refreshSession();
      if (refreshed?.accessToken) {
        originalRequest.headers.Authorization = `Bearer ${refreshed.accessToken}`;
        return api(originalRequest);
      }

      setAccessToken(null);
      window.location.href = '/login';
    }

    return Promise.reject(error);
  },
);

export { api };
export default api;
