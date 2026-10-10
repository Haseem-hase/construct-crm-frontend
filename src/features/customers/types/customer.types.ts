export type CustomerType = 'COMPANY' | 'GOVERNMENT' | 'INDIVIDUAL' | 'OTHER';
export type CustomerStatus = 'Active' | 'Inactive';

export interface Customer {
  id: string;
  organizationId?: string;
  customerCode: string;
  name: string;
  type: CustomerType;
  profileImageUrl?: string | null;
  country?: string;
  city: string;
  address?: string | null;
  isActive?: boolean;
  parentCustomerId?: string | null;
  createdAt: string;
  updatedAt?: string;
  
  // Temporary fields for UI compatibility until Phase 4
  status?: CustomerStatus;
  email?: string;
  phone?: string;
  alternativePhone?: string;
}

export interface CreateCustomerRequest {
  name: string;
  type: CustomerType;
  profileImageUrl?: string;
  country: string;
  city: string;
  address?: string;
  parentCustomerId?: string;
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {
  isActive?: boolean;
}

export interface GetCustomersResponse {
  success: boolean;
  message: string;
  data: {
    customers: Customer[];
  };
}

export interface GetCustomerResponse {
  success: boolean;
  message: string;
  data: {
    customer: Customer;
  };
}
