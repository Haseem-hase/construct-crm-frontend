import React from 'react';
import { DashboardHeader } from '@/src/features/dashboard/components/dashboard-header';
import { SummaryCards } from '@/src/features/dashboard/components/summary-cards';
import { LabourAvailabilitySection } from '@/src/features/dashboard/components/labour-availability';
import { ProjectStatusSection } from '@/src/features/dashboard/components/project-status';
import { ProjectProgressSection } from '@/src/features/dashboard/components/project-progress';
import { ContractorOverviewSection } from '@/src/features/dashboard/components/contractor-overview';
import { LabourAssignmentOverview } from '@/src/features/dashboard/components/labour-assignment-overview';
import { ContractorAssignmentOverview } from '@/src/features/dashboard/components/contractor-assignment-overview';
import { UpcomingLabourAssignments } from '@/src/features/dashboard/components/upcoming-labour-assignments';
import { RecentActivity } from '@/src/features/dashboard/components/recent-activity';
import { AttentionRequired } from '@/src/features/dashboard/components/attention-required';
import { mockDashboardData } from '@/src/features/dashboard/data/dashboard.mock';
import { mockPermissions } from '@/src/features/dashboard/permissions/dashboard-permissions';

export default function DashboardPage() {
  const data = mockDashboardData;
  const perms = mockPermissions;

  return (
    <div className="pb-8">
      <DashboardHeader />
      
      <div className="space-y-6">
        {/* Top: Summary Cards */}
        <SummaryCards data={data.summary} />
        
        {/* Middle: Labour Availability + Project Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {perms.labourView && <LabourAvailabilitySection data={data.labourAvailability} />}
          {perms.projectView && <ProjectStatusSection data={data.projectStatus} />}
        </div>
        
        {/* Next: Project Progress + Contractor Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {perms.projectView && <ProjectProgressSection data={data.projectProgress} />}
          {perms.contractorView && <ContractorOverviewSection data={data.contractorOverview} />}
        </div>
        
        {/* Next: Labour Assignments + Contractor Assignments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {perms.labourView && <LabourAssignmentOverview data={data.labourAssignments} />}
          {perms.contractorView && <ContractorAssignmentOverview data={data.contractorAssignments} />}
        </div>
        
        {/* Bottom: Upcoming Labour Assignments */}
        {perms.labourView && (
          <div>
            <UpcomingLabourAssignments data={data.upcomingLabourAssignments} />
          </div>
        )}
        
        {/* Bottom: Recent Activity & Attention Required */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentActivity data={data.recentActivity} />
          <AttentionRequired data={data.attentionRequired} />
        </div>
      </div>
    </div>
  );
}