import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';

export function ProjectLabourOverview() {
  // Mock data for UI presentation phase only
  const labourTeams = [
    { id: 1, type: 'Skilled Masons', contractor: 'Apex Builders LLC', count: 12, status: 'On Site' },
    { id: 2, type: 'Electricians', contractor: 'Desert Oasis MEP', count: 8, status: 'Scheduled' },
    { id: 3, type: 'General Labor', contractor: 'Direct Hire', count: 4, status: 'On Site' }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Labour Teams</CardTitle>
        <span className="text-sm font-medium text-neutral-500">24 Workers</span>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-neutral-100 text-neutral-500 font-medium">
                <th className="pb-3 pt-2 font-medium">Labour</th>
                <th className="pb-3 pt-2 font-medium">Contractor</th>
                <th className="pb-3 pt-2 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {labourTeams.map((l, i) => (
                <tr key={l.id} className={i !== labourTeams.length - 1 ? 'border-b border-neutral-100' : ''}>
                  <td className="py-3">
                    <div className="font-medium text-neutral-900">{l.type}</div>
                    <div className="text-[12px] text-neutral-500">{l.count} assigned</div>
                  </td>
                  <td className="py-3 text-neutral-600">{l.contractor}</td>
                  <td className="py-3 text-right">
                    <Badge variant={l.status === 'On Site' ? 'info' : 'default'}>
                      {l.status}
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
