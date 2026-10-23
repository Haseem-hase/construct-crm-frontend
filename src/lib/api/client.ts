import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './token';
import { authApi } from '../../features/auth/api/auth-api';

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _authGeneration?: number;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

type Subscriber = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let refreshSubscribers: Subscriber[] = [];
let authSessionGeneration = 0;
let activeRefreshGeneration: number | null = null;

function notifySessionExpired() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('constructcrm:session-expired'));
  }
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach(({ resolve }) => resolve(token));
  refreshSubscribers = [];
}

function onRefreshFailed(error: unknown) {
  refreshSubscribers.forEach(({ reject }) => reject(error));
  refreshSubscribers = [];
}

/** Invalidates an in-flight refresh before local logout clears the cookies. */
export function invalidatePendingAuthRefreshes() {
  authSessionGeneration += 1;
  onRefreshFailed(new Error('Authentication session ended.'));
  isRefreshing = false;
  activeRefreshGeneration = null;
}

apiClient.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    config._authGeneration = authSessionGeneration;
    const accessToken = getAccessToken();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const authEndpoints = ['/auth/login', '/auth/refresh', '/auth/logout'];
    if (originalRequest.url && authEndpoints.some((endpoint) => originalRequest.url?.includes(endpoint))) {
      return Promise.reject(error);
    }

    // A request started before local logout must never refresh or clear a
    // newer session if its response arrives afterward.
    if (originalRequest._authGeneration !== authSessionGeneration) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && originalRequest._retry) {
      clearTokens();
      notifySessionExpired();
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        notifySessionExpired();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshSubscribers.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(apiClient(originalRequest));
            },
            reject: (err: unknown) => {
              reject(err);
            }
          });
        });
      }

      isRefreshing = true;
      const refreshGeneration = authSessionGeneration;
      activeRefreshGeneration = refreshGeneration;

      try {
        const response = await authApi.refresh({ refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        if (refreshGeneration !== authSessionGeneration) {
          // Refresh rotates the server-side token before returning. Revoke
          // that successor too if logout won the race locally.
          try {
            await authApi.logout({ refreshToken: newRefreshToken });
          } catch {
            // Local logout remains complete if the best-effort revoke fails.
          }
          return Promise.reject(error);
        }
        
        setTokens(accessToken, newRefreshToken);
        onRefreshed(accessToken);
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        if (refreshGeneration === authSessionGeneration) {
          onRefreshFailed(refreshError);
          clearTokens();
          notifySessionExpired();
        }
        return Promise.reject(error);
      } finally {
        if (activeRefreshGeneration === refreshGeneration) {
          isRefreshing = false;
          activeRefreshGeneration = null;
        }
      }
    }

    return Promise.reject(error);
  }
);
