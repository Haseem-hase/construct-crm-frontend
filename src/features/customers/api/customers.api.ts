import { apiClient } from '@/src/lib/api/client';
import { 
  GetCustomersResponse, 
  GetCustomerResponse, 
  CreateCustomerRequest, 
  UpdateCustomerRequest 
} from '../types/customer.types';

export const customersApi = {
  getCustomers: async (): Promise<GetCustomersResponse> => {
    const response = await apiClient.get<GetCustomersResponse>('/customers');
    return response.data;
  },
  
  getCustomer: async (id: string): Promise<GetCustomerResponse> => {
    const response = await apiClient.get<GetCustomerResponse>(`/customers/${id}`);
    return response.data;
  },

  getCustomerChildren: async (id: string): Promise<GetCustomersResponse> => {
    const response = await apiClient.get<GetCustomersResponse>(`/customers/${id}/children`);
    return response.data;
  },

  createCustomer: async (payload: CreateCustomerRequest, image?: File): Promise<GetCustomerResponse> => {
    const response = await apiClient.post<GetCustomerResponse>('/customers', image ? toMultipart(payload, image) : payload);
    return response.data;
  },

  updateCustomer: async (id: string, payload: UpdateCustomerRequest, image?: File): Promise<GetCustomerResponse> => {
    const response = await apiClient.patch<GetCustomerResponse>(`/customers/${id}`, image ? toMultipart(payload, image) : payload);
    return response.data;
  },

  deleteCustomer: async (id: string): Promise<{ success: boolean; message: string; data?: any }> => {
    const response = await apiClient.delete<{ success: boolean; message: string; data?: any }>(`/customers/${id}`);
    return response.data;
  },
};

function toMultipart(payload: CreateCustomerRequest | UpdateCustomerRequest, image: File) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === null) formData.append(key, '');
    else if (value !== undefined) formData.append(key, String(value));
  });
  formData.append('image', image);
  return formData;
}
