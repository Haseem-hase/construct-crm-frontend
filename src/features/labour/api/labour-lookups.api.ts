import { apiClient } from '@/src/lib/api/client';
import type { ApiEnvelope } from '@/src/features/projects/api/projects.api';

export type LookupItem = { id: string; name: string };
export const labourLookupsApi = {
  async professions() { return (await apiClient.get<ApiEnvelope<{ professions: LookupItem[] }>>('/professions')).data.data.professions; },
};
