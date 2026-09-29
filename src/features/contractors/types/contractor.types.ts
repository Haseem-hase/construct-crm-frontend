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
