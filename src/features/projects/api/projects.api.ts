import type { ProjectImageDetails } from '../types/project.types';
import { apiClient } from '@/src/lib/api/client';

export type ApiEnvelope<T> = { success: boolean; message: string; data: T };
export type ApiProjectStatus = 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
export type ApiProjectCustomer = { id: string; customerId: string; relationshipType: 'OWNER' | 'CLIENT' | 'DEVELOPER' | 'INVESTOR' | 'PARTNER' | 'OTHER'; isPrimary: boolean; customer?: { id: string; name: string; customerCode: string; type: string; country?: string | null; city?: string | null } };
export type ApiProjectImage = ProjectImageDetails & { id: string; imageUrl: string; alt: string | null; isCover: boolean; position: number };
export type ApiProject = {
  id: string; projectCode: string; name: string; description: string | null; status: ApiProjectStatus;
  organization?: { id: string; name: string };
  country: string; city: string | null; address: string | null; plannedStartDate: string | null; plannedEndDate: string | null;
  actualStartDate: string | null; actualEndDate: string | null; progress: number; areaSqFt?: number | null; budget: number | null; imageUrl: string | null;
  createdAt: string; projectCustomers?: ApiProjectCustomer[]; images?: ApiProjectImage[];
};
export type ProjectGalleryItem = ProjectImageDetails & (
  | { source: 'existing'; id: string; isCover: boolean }
  | { source: 'upload'; uploadIndex: number; isCover: boolean; alt?: string }
  | { source: 'url'; url: string; isCover: boolean; alt?: string });
export type ProjectPayload = {
  name: string; description?: string | null; imageUrl?: string | null; images?: File[]; imageGallery?: ProjectGalleryItem[]; status?: ApiProject['status']; country: string; city?: string | null; address?: string | null;
  plannedStartDate?: string | null; plannedEndDate?: string | null; progress?: number; areaSqFt?: number | null; budget?: number | null; customerId?: string;
};

const projectPayload = (payload: Partial<ProjectPayload>) => {
  const { images, imageGallery, ...fields } = payload;
  if (imageGallery === undefined && !images?.length) return fields;

  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined) formData.append(key, value === null ? 'null' : String(value));
  });
  if (imageGallery !== undefined) formData.append('imageGallery', JSON.stringify(imageGallery));
  images?.forEach(file => formData.append('images', file));
  return formData;
};

export const projectsApi = {
  async list() { return (await apiClient.get<ApiEnvelope<ApiProject[]>>('/projects')).data.data; },
  async get(id: string) { return (await apiClient.get<ApiEnvelope<ApiProject>>(`/projects/${id}`)).data.data; },
  async create(payload: ProjectPayload) { return (await apiClient.post<ApiEnvelope<ApiProject>>('/projects', projectPayload(payload))).data.data; },
  async update(id: string, payload: Partial<ProjectPayload>) { return (await apiClient.patch<ApiEnvelope<ApiProject>>(`/projects/${id}`, projectPayload(payload))).data.data; },
  async remove(id: string) { return (await apiClient.delete<ApiEnvelope<boolean>>(`/projects/${id}`)).data; },
  async getCustomers(id: string) { return (await apiClient.get<ApiEnvelope<ApiProjectCustomer[]>>(`/projects/${id}/customers`)).data.data; },
  async addCustomer(id: string, customerId: string) { return (await apiClient.post<ApiEnvelope<ApiProjectCustomer>>(`/projects/${id}/customers`, { customerId, relationshipType: 'OWNER', isPrimary: true })).data.data; },
  async updateCustomerRelationship(id: string, relationshipId: string, payload: { relationshipType?: ApiProjectCustomer['relationshipType']; isPrimary?: boolean }) { return (await apiClient.patch<ApiEnvelope<ApiProjectCustomer>>(`/projects/${id}/customers/${relationshipId}`, payload)).data.data; },
};
