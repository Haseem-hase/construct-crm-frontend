import { apiClient } from '@/src/lib/api/client';
import { GetRolesResponse, GetRoleResponse, CreateRoleRequest } from '../types/roles.types';

export const rolesApi = {
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
};
