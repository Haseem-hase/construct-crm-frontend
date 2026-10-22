import { apiClient } from '@/src/lib/api/client';
import type { ApiEnvelope } from '@/src/features/projects/api/projects.api';
import type { LookupItem } from '@/src/features/labour/api/labour-lookups.api';

export const assignmentLookupsApi = {
  async responsibilities() { return (await apiClient.get<ApiEnvelope<{ responsibilities: LookupItem[] }>>('/responsibilities')).data.data.responsibilities; },
};
