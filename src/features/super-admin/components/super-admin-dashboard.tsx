import React from 'react';
import { SuperAdminHeader } from '@/src/features/super-admin/components/super-admin-header';
import { PlatformSummaryCards } from '@/src/features/super-admin/components/platform-summary-cards';
import { OrganizationOverview } from '@/src/features/super-admin/components/organization-overview';
import { OrganizationGrowth } from '@/src/features/super-admin/components/organization-growth';
import { UserOverview } from '@/src/features/super-admin/components/user-overview';
import { PlatformActivity } from '@/src/features/super-admin/components/platform-activity';
import { GlobalRolesOverview } from '@/src/features/super-admin/components/global-roles-overview';
import { SystemHealth } from '@/src/features/super-admin/components/system-health';
import { AttentionRequired } from '@/src/features/super-admin/components/attention-required';
import { mockSuperAdminData } from '@/src/features/super-admin/data/super-admin.mock';

export function SuperAdminDashboard() {
  const data = mockSuperAdminData;

  return (
    <div className="pb-8">
      <SuperAdminHeader />

      <div role="note" className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Demo data: the statistics, organization records, user activity, role counts, and system health shown below are sample values, not live platform data.
      </div>

      <div className="space-y-6">
        <PlatformSummaryCards data={data.summary} />
        <OrganizationOverview data={data.organizations} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OrganizationGrowth data={data.growth} />
          <UserOverview stats={data.userStats} recentUsers={data.recentUsers} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PlatformActivity data={data.activity} />
          <GlobalRolesOverview roles={data.roles} stats={data.rolesStats} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SystemHealth data={data.systemHealth} />
          <AttentionRequired data={data.attentionRequired} />
        </div>
      </div>
    </div>
  );
}
