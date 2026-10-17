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

  createCustomer: async (payload: CreateCustomerRequest): Promise<GetCustomerResponse> => {
    const response = await apiClient.post<GetCustomerResponse>('/customers', payload);
    return response.data;
  },

  updateCustomer: async (id: string, payload: UpdateCustomerRequest): Promise<GetCustomerResponse> => {
    const response = await apiClient.patch<GetCustomerResponse>(`/customers/${id}`, payload);
    return response.data;
  },

  deleteCustomer: async (id: string): Promise<{ success: boolean; message: string; data?: any }> => {
    const response = await apiClient.delete<{ success: boolean; message: string; data?: any }>(`/customers/${id}`);
    return response.data;
  },
};
