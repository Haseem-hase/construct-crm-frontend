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

  createContractor: async (payload: CreateContractorRequest, image?: File): Promise<GetContractorResponse> => {
    const response = await apiClient.post<GetContractorResponse>('/contractors', image ? toMultipart(payload, image) : payload);
    return response.data;
  },

  updateContractor: async (id: string, payload: UpdateContractorRequest, image?: File): Promise<GetContractorResponse> => {
    const response = await apiClient.patch<GetContractorResponse>(`/contractors/${id}`, image ? toMultipart(payload, image) : payload);
    return response.data;
  },
};

function toMultipart(payload: CreateContractorRequest | UpdateContractorRequest, image: File) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === null) formData.append(key, '');
    else if (value !== undefined) formData.append(key, String(value));
  });
  formData.append('image', image);
  return formData;
}
