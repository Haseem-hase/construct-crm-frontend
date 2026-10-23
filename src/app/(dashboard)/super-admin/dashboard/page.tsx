import { SuperAdminGuard } from '@/src/features/super-admin/components/super-admin-guard';
import { SuperAdminDashboard } from '@/src/features/super-admin/components/super-admin-dashboard';

export default function SuperAdminDashboardPage() {
  return (
    <SuperAdminGuard>
      <SuperAdminDashboard />
    </SuperAdminGuard>
  );
}
