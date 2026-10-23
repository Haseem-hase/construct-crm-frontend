import { apiClient } from '@/src/lib/api/client';

export type ApiEnvelope<T> = { success: boolean; message: string; data: T };
export type ApiProjectStatus = 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
export type ApiProjectCustomer = { id: string; customerId: string; relationshipType: 'OWNER' | 'CLIENT' | 'DEVELOPER' | 'INVESTOR' | 'PARTNER' | 'OTHER'; isPrimary: boolean; customer?: { id: string; name: string; customerCode: string; type: string; country?: string | null; city?: string | null } };
export type ApiProject = {
  id: string; projectCode: string; name: string; description: string | null; status: ApiProjectStatus;
  country: string; city: string | null; address: string | null; plannedStartDate: string | null; plannedEndDate: string | null;
  actualStartDate: string | null; actualEndDate: string | null; progress: number; budget: number | null; imageUrl: string | null;
  createdAt: string; projectCustomers?: ApiProjectCustomer[];
};
export type ProjectPayload = {
  name: string; description?: string | null; imageUrl?: string | null; status?: ApiProject['status']; country: string; city?: string | null; address?: string | null;
  plannedStartDate?: string | null; plannedEndDate?: string | null; progress?: number; budget?: number | null; customerId?: string;
};

export const projectsApi = {
  async list() { return (await apiClient.get<ApiEnvelope<ApiProject[]>>('/projects')).data.data; },
  async get(id: string) { return (await apiClient.get<ApiEnvelope<ApiProject>>(`/projects/${id}`)).data.data; },
  async create(payload: ProjectPayload) { return (await apiClient.post<ApiEnvelope<ApiProject>>('/projects', payload)).data.data; },
  async update(id: string, payload: Partial<ProjectPayload>) { return (await apiClient.patch<ApiEnvelope<ApiProject>>(`/projects/${id}`, payload)).data.data; },
  async remove(id: string) { return (await apiClient.delete<ApiEnvelope<boolean>>(`/projects/${id}`)).data; },
  async getCustomers(id: string) { return (await apiClient.get<ApiEnvelope<ApiProjectCustomer[]>>(`/projects/${id}/customers`)).data.data; },
  async addCustomer(id: string, customerId: string) { return (await apiClient.post<ApiEnvelope<ApiProjectCustomer>>(`/projects/${id}/customers`, { customerId, relationshipType: 'OWNER', isPrimary: true })).data.data; },
  async updateCustomerRelationship(id: string, relationshipId: string, payload: { relationshipType?: ApiProjectCustomer['relationshipType']; isPrimary?: boolean }) { return (await apiClient.patch<ApiEnvelope<ApiProjectCustomer>>(`/projects/${id}/customers/${relationshipId}`, payload)).data.data; },
};
