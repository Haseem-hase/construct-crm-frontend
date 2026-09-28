import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';

export function ProjectContractorOverview() {
  // Mock data for UI presentation phase only
  const contractors = [
    { id: 1, name: 'Apex Builders LLC', status: 'Active', assignment: 'Lead Structural' },
    { id: 2, name: 'Desert Oasis MEP', status: 'Active', assignment: 'MEP Installation' },
    { id: 3, name: 'Rapid Foundations', status: 'Completed', assignment: 'Foundation Prep' }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Contractors</CardTitle>
        <span className="text-sm font-medium text-neutral-500">3 Assigned</span>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-neutral-100 text-neutral-500 font-medium">
                <th className="pb-3 pt-2 font-medium">Contractor</th>
                <th className="pb-3 pt-2 font-medium">Assignment</th>
                <th className="pb-3 pt-2 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {contractors.map((c, i) => (
                <tr key={c.id} className={i !== contractors.length - 1 ? 'border-b border-neutral-100' : ''}>
                  <td className="py-3 font-medium text-neutral-900">{c.name}</td>
                  <td className="py-3 text-neutral-600">{c.assignment}</td>
                  <td className="py-3 text-right">
                    <Badge variant={c.status === 'Active' ? 'success' : 'neutral'}>
                      {c.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
