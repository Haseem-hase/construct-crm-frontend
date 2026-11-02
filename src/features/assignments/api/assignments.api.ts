import { apiClient } from '@/src/lib/api/client';
import type { ApiEnvelope } from '@/src/features/projects/api/projects.api';

export type ApiContractorAssignment = { id: string; projectId: string; contractorId: string; responsibilities: { responsibilityId: string; responsibility: { id: string; name: string } }[]; scopeDescription: string | null; startDate: string | null; endDate: string | null; status: 'PENDING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'TERMINATED' | 'CANCELLED'; notes: string | null; project: { id: string; name: string; projectCode: string; organization?: { id: string; name: string } }; contractor: { id: string; fullName: string; contractorCode: string; organization?: { id: string; name: string } }; createdAt: string };
export type ContractorAssignmentPayload = { projectId: string; contractorId: string; responsibilityIds?: string[]; scopeDescription?: string; startDate?: string; endDate?: string; notes?: string };
export const assignmentsApi = {
  async list(filters: { projectId?: string; contractorId?: string; status?: ApiContractorAssignment['status'] } = {}) { return (await apiClient.get<ApiEnvelope<{ assignments: ApiContractorAssignment[] }>>('/contractor-project-assignments', { params: filters })).data.data.assignments; },
  async get(id: string) { return (await apiClient.get<ApiEnvelope<{ assignment: ApiContractorAssignment }>>(`/contractor-project-assignments/${id}`)).data.data.assignment; },
  async create(payload: ContractorAssignmentPayload) { return (await apiClient.post<ApiEnvelope<{ assignment: ApiContractorAssignment }>>('/contractor-project-assignments', payload)).data.data.assignment; },
  async update(id: string, payload: Partial<ContractorAssignmentPayload> & { status?: ApiContractorAssignment['status'] }) { return (await apiClient.patch<ApiEnvelope<{ assignment: ApiContractorAssignment }>>(`/contractor-project-assignments/${id}`, payload)).data.data.assignment; },
};
