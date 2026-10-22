import { apiClient } from '@/src/lib/api/client';

export type ApiEnvelope<T> = { success: boolean; message: string; data: T };
export type ApiProject = {
  id: string; projectCode: string; name: string; description: string | null; status: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  country: string; city: string | null; address: string | null; plannedStartDate: string | null; plannedEndDate: string | null;
  actualStartDate: string | null; actualEndDate: string | null; progress: number; budget: number | null; imageUrl: string | null;
  createdAt: string; projectCustomers?: { customer: { id: string; name: string }; isPrimary?: boolean }[];
};
export type ProjectPayload = {
  name: string; description?: string; status?: ApiProject['status']; country: string; city?: string; address?: string;
  plannedStartDate?: string; plannedEndDate?: string; progress?: number; budget?: number; customerId?: string;
};

export const projectsApi = {
  async list() { return (await apiClient.get<ApiEnvelope<ApiProject[]>>('/projects')).data.data; },
  async get(id: string) { return (await apiClient.get<ApiEnvelope<ApiProject>>(`/projects/${id}`)).data.data; },
  async create(payload: ProjectPayload) { return (await apiClient.post<ApiEnvelope<ApiProject>>('/projects', payload)).data.data; },
  async update(id: string, payload: Partial<ProjectPayload>) { return (await apiClient.patch<ApiEnvelope<ApiProject>>(`/projects/${id}`, payload)).data.data; },
  async remove(id: string) { return (await apiClient.delete<ApiEnvelope<boolean>>(`/projects/${id}`)).data; },
};
