import { SuperAdminGuard } from '@/src/features/super-admin/components/super-admin-guard';

export default function OrganizationsLayout({ children }: { children: React.ReactNode }) {
  return <SuperAdminGuard>{children}</SuperAdminGuard>;
}
