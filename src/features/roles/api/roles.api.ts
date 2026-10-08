import { apiClient } from '@/src/lib/api/client';
import { GetRolesResponse, GetRoleResponse } from '../types/roles.types';

export const rolesApi = {
  getRoles: async (): Promise<GetRolesResponse> => {
    const response = await apiClient.get<GetRolesResponse>('/roles');
    return response.data;
  },
  
  getRole: async (id: string): Promise<GetRoleResponse> => {
    const response = await apiClient.get<GetRoleResponse>(`/roles/${id}`);
    return response.data;
  },
};
