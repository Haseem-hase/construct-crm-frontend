import React from 'react';
import { UpcomingLabourAssignment } from '../types/dashboard.types';

export function UpcomingLabourAssignments({ data }: { data: UpcomingLabourAssignment[] }) {
  return (
    <div className="bg-white rounded-lg border border-neutral-200/60 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="px-6 py-5 border-b border-neutral-200/60">
        <h3 className="text-base font-semibold text-neutral-900 tracking-tight">Upcoming Labour Assignments</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-neutral-50/50 text-neutral-500 font-medium border-b border-neutral-200/60">
            <tr>
              <th className="px-6 py-3 font-medium">Labour</th>
              <th className="px-6 py-3 font-medium">Project</th>
              <th className="px-6 py-3 font-medium">Start Date</th>
              <th className="px-6 py-3 font-medium">End Date</th>
              <th className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {data.map((assignment) => (
              <tr key={assignment.id} className="hover:bg-neutral-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-neutral-900 whitespace-nowrap">{assignment.labourName}</td>
                <td className="px-6 py-4 text-neutral-600 whitespace-nowrap">{assignment.projectName}</td>
                <td className="px-6 py-4 text-neutral-600 whitespace-nowrap">{assignment.startDate}</td>
                <td className="px-6 py-4 text-neutral-600 whitespace-nowrap">{assignment.endDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200/60">
                    {assignment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
