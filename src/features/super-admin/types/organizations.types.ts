export interface Organization {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface OrganizationListQuery {
  search?: string;
  page: number;
  pageSize: number;
}

export interface OrganizationListResult {
  organizations: Organization[];
  pagination: OrganizationPagination;
}

export interface CreateOrganizationRequest {
  organizationName: string;
  description?: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface OrganizationOwner {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  organizationId: string;
  organizationRoleId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationResult {
  organization: Organization;
  owner: OrganizationOwner;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}
