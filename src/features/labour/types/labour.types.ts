export type LabourStatus = 'ACTIVE' | 'INACTIVE';

export interface Labour {
  id: string;
  professionId: string;
  professionName: string;
  fullName: string;
  phone: string;
  email?: string;
  dateOfBirth?: string;
  country: string;
  city: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  joiningDate?: string;
  status: LabourStatus;
  profileImageUrl?: string;
  notes?: string;
}
