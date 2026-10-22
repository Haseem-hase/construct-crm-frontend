import { apiClient } from '@/src/lib/api/client';
import type { ApiEnvelope } from '@/src/features/projects/api/projects.api';

export type ApiLabourAssignment = { id: string; labourId: string; contractorProjectAssignmentId: string; startDate: string; endDate: string; status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'; notes: string | null; labour: { id: string; fullName: string; phone: string; professionId: string }; assignment: { id: string; project: { id: string; projectCode: string; name: string }; contractor: { id: string; contractorCode: string; fullName: string } }; createdAt: string };
export type LabourAssignmentPayload = { labourId: string; contractorProjectAssignmentId: string; startDate: string; endDate: string; notes?: string };
export const labourAssignmentsApi = {
  async list() { return (await apiClient.get<ApiEnvelope<{ assignments: ApiLabourAssignment[] }>>('/labour-assignments')).data.data.assignments; },
  async get(id: string) { return (await apiClient.get<ApiEnvelope<{ assignment: ApiLabourAssignment }>>(`/labour-assignments/${id}`)).data.data.assignment; },
  async create(payload: LabourAssignmentPayload) { return (await apiClient.post<ApiEnvelope<{ assignment: ApiLabourAssignment }>>('/labour-assignments', payload)).data.data.assignment; },
  async update(id: string, payload: Partial<LabourAssignmentPayload> & { status?: ApiLabourAssignment['status'] }) { return (await apiClient.patch<ApiEnvelope<{ assignment: ApiLabourAssignment }>>(`/labour-assignments/${id}`, payload)).data.data.assignment; },
};
