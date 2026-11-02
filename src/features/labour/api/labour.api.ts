import { apiClient } from '@/src/lib/api/client';
import type { ApiEnvelope } from '@/src/features/projects/api/projects.api';

export type ApiLabour = { id: string; fullName: string; phone: string; email: string | null; professionId: string; profession: { id: string; name: string }; organization?: { id: string; name: string }; country: string; city: string; address: string | null; dateOfBirth: string | null; emergencyContactName: string | null; emergencyContactPhone: string | null; joiningDate: string | null; status: 'ACTIVE' | 'INACTIVE'; profileImageUrl: string | null; notes: string | null };
export type LabourPayload = Partial<Omit<ApiLabour, 'id' | 'profession'>> & { fullName: string; phone: string; professionId: string; country: string; city: string };
export const labourApi = {
  async list() { return (await apiClient.get<ApiEnvelope<{ labours: ApiLabour[] }>>('/labours')).data.data.labours; },
  async get(id: string) { return (await apiClient.get<ApiEnvelope<{ labour: ApiLabour }>>(`/labours/${id}`)).data.data.labour; },
  async create(payload: LabourPayload) { return (await apiClient.post<ApiEnvelope<{ labour: ApiLabour }>>('/labours', payload)).data.data.labour; },
  async update(id: string, payload: Partial<LabourPayload>) { return (await apiClient.patch<ApiEnvelope<{ labour: ApiLabour }>>(`/labours/${id}`, payload)).data.data.labour; },
};
