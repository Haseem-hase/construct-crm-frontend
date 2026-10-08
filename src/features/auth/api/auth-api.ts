import { apiClient } from '../../../lib/api/client';
import {
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
  LogoutRequest,
  LogoutResponse,
  MeResponse,
} from '../types/auth';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  refresh: async (request: RefreshRequest): Promise<RefreshResponse> => {
    const response = await apiClient.post<RefreshResponse>('/auth/refresh', request);
    return response.data;
  },

  logout: async (request: LogoutRequest): Promise<LogoutResponse> => {
    const response = await apiClient.post<LogoutResponse>('/auth/logout', request);
    return response.data;
  },

  getMe: async (): Promise<MeResponse> => {
    const response = await apiClient.get<MeResponse>('/auth/me');
    return response.data;
  },
};
