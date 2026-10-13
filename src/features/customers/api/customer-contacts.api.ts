import { apiClient } from '@/src/lib/api/client';
import {
  GetCustomerContactsResponse,
  GetCustomerContactResponse,
  CreateCustomerContactRequest,
  UpdateCustomerContactRequest,
  DeleteCustomerContactResponse,
} from '../types/customer.types';

export const customerContactsApi = {
  getCustomerContacts: async (customerId: string): Promise<GetCustomerContactsResponse> => {
    const response = await apiClient.get<GetCustomerContactsResponse>(
      `/customers/${customerId}/contacts`
    );
    return response.data;
  },

  getCustomerContact: async (
    customerId: string,
    contactId: string
  ): Promise<GetCustomerContactResponse> => {
    const response = await apiClient.get<GetCustomerContactResponse>(
      `/customers/${customerId}/contacts/${contactId}`
    );
    return response.data;
  },

  createCustomerContact: async (
    customerId: string,
    payload: CreateCustomerContactRequest
  ): Promise<GetCustomerContactResponse> => {
    const response = await apiClient.post<GetCustomerContactResponse>(
      `/customers/${customerId}/contacts`,
      payload
    );
    return response.data;
  },

  updateCustomerContact: async (
    customerId: string,
    contactId: string,
    payload: UpdateCustomerContactRequest
  ): Promise<GetCustomerContactResponse> => {
    const response = await apiClient.patch<GetCustomerContactResponse>(
      `/customers/${customerId}/contacts/${contactId}`,
      payload
    );
    return response.data;
  },

  deleteCustomerContact: async (
    customerId: string,
    contactId: string
  ): Promise<DeleteCustomerContactResponse> => {
    const response = await apiClient.delete<DeleteCustomerContactResponse>(
      `/customers/${customerId}/contacts/${contactId}`
    );
    return response.data;
  },
};
