// ==========================================
// Backend-aligned API Entity & Types
// ==========================================
export type ApiContractorStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE' | 'TERMINATED';

export interface ApiContractor {
  id: string;
  organizationId: string;
  contractorCode: string;
  fullName: string;
  profileImageUrl?: string | null;
  email?: string | null;
  phone: string;
  alternativePhone?: string | null;
  country: string;
  city: string;
  address?: string | null;
  nationalId?: string | null;
  licenseNumber?: string | null;
  licenseExpiryDate?: string | null;
  status: ApiContractorStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string;
}

// Request Types
export interface CreateContractorRequest {
  fullName: string;
  phone: string;
  country: string;
  city: string;
  email?: string;
  alternativePhone?: string;
  address?: string;
  profileImageUrl?: string;
  nationalId?: string;
  licenseNumber?: string;
  licenseExpiryDate?: string;
  status?: ApiContractorStatus;
  notes?: string;
}

export interface UpdateContractorRequest {
  fullName?: string;
  phone?: string;
  country?: string;
  city?: string;
  email?: string;
  alternativePhone?: string;
  address?: string;
  profileImageUrl?: string;
  nationalId?: string;
  licenseNumber?: string;
  licenseExpiryDate?: string | null;
  status?: ApiContractorStatus;
  notes?: string;
}

// Response Envelopes
export interface GetContractorsResponse {
  success: boolean;
  message: string;
  data: {
    contractors: ApiContractor[];
  };
}

export interface GetContractorResponse {
  success: boolean;
  message: string;
  data: {
    contractor: ApiContractor;
  };
}

// ==========================================
// Legacy UI Types (preserves un-migrated mock screens until Phase 2+)
// ==========================================
export type ContractorStatus = 'Active' | 'Inactive';

export interface Contractor {
  id: string;
  contractorCode: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  alternativePhone?: string;
  country: string;
  city: string;
  address: string;
  profileImage?: string;
  nationalId?: string;
  licenseNumber: string;
  licenseExpiryDate?: string;
  status: ContractorStatus;
  createdAt: string;
}
