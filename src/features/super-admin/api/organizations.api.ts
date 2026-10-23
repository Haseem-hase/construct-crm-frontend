import { apiClient } from '@/src/lib/api/client';
import {
  ApiEnvelope,
  CreateOrganizationRequest,
  CreateOrganizationResult,
  OrganizationListQuery,
  OrganizationListResult,
} from '../types/organizations.types';

export const organizationsApi = {
  async list(params: OrganizationListQuery): Promise<OrganizationListResult> {
    const response = await apiClient.get<ApiEnvelope<OrganizationListResult>>('/organizations', { params });
    return response.data.data;
  },

  async create(payload: CreateOrganizationRequest): Promise<CreateOrganizationResult> {
    const response = await apiClient.post<ApiEnvelope<CreateOrganizationResult>>('/organizations', payload);
    return response.data.data;
  },
};
