import { apiClient } from '@/src/lib/api/client';
import {
  GetContractorsResponse,
  GetContractorResponse,
  CreateContractorRequest,
  UpdateContractorRequest,
} from '../types/contractor.types';

export const contractorsApi = {
  getContractors: async (): Promise<GetContractorsResponse> => {
    const response = await apiClient.get<GetContractorsResponse>('/contractors');
    return response.data;
  },

  getContractorById: async (id: string): Promise<GetContractorResponse> => {
    const response = await apiClient.get<GetContractorResponse>(`/contractors/${id}`);
    return response.data;
  },

  createContractor: async (payload: CreateContractorRequest): Promise<GetContractorResponse> => {
    const response = await apiClient.post<GetContractorResponse>('/contractors', payload);
    return response.data;
  },

  updateContractor: async (id: string, payload: UpdateContractorRequest): Promise<GetContractorResponse> => {
    const response = await apiClient.patch<GetContractorResponse>(`/contractors/${id}`, payload);
    return response.data;
  },
};
