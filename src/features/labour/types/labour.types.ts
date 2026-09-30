export type LabourStatus = 'ACTIVE' | 'INACTIVE';

export interface Labour {
  id: string;
  professionId: string;
  professionName: string;
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  joiningDate: string;
  status: LabourStatus;
  profileImageUrl?: string;
}
