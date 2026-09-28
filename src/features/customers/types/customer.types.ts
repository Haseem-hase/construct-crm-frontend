export type CustomerType = 'COMPANY' | 'GOVERNMENT' | 'INDIVIDUAL' | 'OTHER';
export type CustomerStatus = 'Active' | 'Inactive';

export interface Customer {
  id: string;
  customerCode: string;
  name: string;
  type: CustomerType;
  email: string;
  phone: string;
  alternativePhone?: string;
  country?: string;
  city: string;
  address?: string;
  status: CustomerStatus;
  parentCustomerId?: string;
  createdAt: string;
}
