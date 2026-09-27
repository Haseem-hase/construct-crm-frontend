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

export default function SuperAdminPage() {
  const data = mockSuperAdminData;

  return (
    <div className="pb-8">
      <SuperAdminHeader />
      
      <div className="space-y-6">
        {/* Top: Summary Cards */}
        <PlatformSummaryCards data={data.summary} />
        
        {/* Large block: Organization Overview */}
        <OrganizationOverview data={data.organizations} />
        
        {/* Split block: Organization Growth & User Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OrganizationGrowth data={data.growth} />
          <UserOverview stats={data.userStats} recentUsers={data.recentUsers} />
        </div>
        
        {/* Split block: Platform Activity & Global Roles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PlatformActivity data={data.activity} />
          <GlobalRolesOverview roles={data.roles} stats={data.rolesStats} />
        </div>
        
        {/* Bottom block: System Health & Attention Required */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SystemHealth data={data.systemHealth} />
          <AttentionRequired data={data.attentionRequired} />
        </div>
      </div>
    </div>
  );
}
