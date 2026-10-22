import { apiClient } from '@/src/lib/api/client';
import { GetRolesResponse, GetRoleResponse, GetGlobalRolesResponse, GetGlobalRoleResponse, CreateRoleRequest, UpdateRoleRequest } from '../types/roles.types';

export const rolesApi = {
  getGlobalRoles: async (): Promise<GetGlobalRolesResponse> => {
    const response = await apiClient.get<GetGlobalRolesResponse>('/roles/global');
    return response.data;
  },
  getGlobalRole: async (id: string): Promise<GetGlobalRoleResponse> => (await apiClient.get<GetGlobalRoleResponse>(`/roles/global/${id}`)).data,
  createGlobalRole: async (payload: CreateRoleRequest): Promise<GetGlobalRoleResponse> => (await apiClient.post<GetGlobalRoleResponse>('/roles/global', payload)).data,
  updateGlobalRole: async (id: string, payload: UpdateRoleRequest): Promise<GetGlobalRoleResponse> => (await apiClient.patch<GetGlobalRoleResponse>(`/roles/global/${id}`, payload)).data,
  deleteGlobalRole: async (id: string) => (await apiClient.delete<{ success: boolean; message: string; data: { role: unknown } }>(`/roles/global/${id}`)).data,
  getRoles: async (): Promise<GetRolesResponse> => {
    const response = await apiClient.get<GetRolesResponse>('/roles');
    return response.data;
  },
  
  getRole: async (id: string): Promise<GetRoleResponse> => {
    const response = await apiClient.get<GetRoleResponse>(`/roles/${id}`);
    return response.data;
  },

  createRole: async (payload: CreateRoleRequest): Promise<GetRoleResponse> => {
    const response = await apiClient.post<GetRoleResponse>('/roles', payload);
    return response.data;
  },

  updateRole: async (id: string, payload: UpdateRoleRequest): Promise<GetRoleResponse> => {
    const response = await apiClient.patch<GetRoleResponse>(`/roles/${id}`, payload);
    return response.data;
  },

  deleteRole: async (id: string): Promise<{ success: boolean; message: string; data?: any }> => {
    const response = await apiClient.delete<{ success: boolean; message: string; data?: any }>(`/roles/${id}`);
    return response.data;
  },
};
