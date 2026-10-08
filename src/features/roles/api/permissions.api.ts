import { apiClient } from '@/src/lib/api/client';
import { GetPermissionsResponse } from '../types/roles.types';

export const permissionsApi = {
  getPermissions: async (): Promise<GetPermissionsResponse> => {
    const response = await apiClient.get<GetPermissionsResponse>('/permissions');
    return response.data;
  },
};
