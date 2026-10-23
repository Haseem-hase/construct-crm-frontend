import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { ApiLabourAssignment } from '@/src/features/labour-assignments/api/labour-assignments.api';

export function ProjectLabourOverview({ assignments }: { assignments: ApiLabourAssignment[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle>Labour</CardTitle><span className="text-sm font-medium text-neutral-500">{assignments.length} Assigned</span></CardHeader>
      <CardContent>
        {assignments.length === 0 ? <p className="py-6 text-center text-sm text-neutral-500">No labour assignments for this project yet.</p> : (
          <div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead><tr className="border-b border-neutral-100 text-neutral-500 font-medium"><th className="pb-3 pt-2 font-medium">Labour</th><th className="pb-3 pt-2 font-medium">Contractor</th><th className="pb-3 pt-2 font-medium text-right">Status</th></tr></thead><tbody>
            {assignments.map((a, i) => <tr key={a.id} className={i !== assignments.length - 1 ? 'border-b border-neutral-100' : ''}><td className="py-3"><div className="font-medium text-neutral-900">{a.labour.fullName}</div><div className="text-xs text-neutral-500">{a.labour.phone}</div></td><td className="py-3 text-neutral-600">{a.assignment.contractor.fullName}</td><td className="py-3 text-right"><Badge variant={a.status === 'ACTIVE' ? 'success' : a.status === 'CANCELLED' ? 'destructive' : 'neutral'}>{a.status}</Badge></td></tr>)}
          </tbody></table></div>
        )}
      </CardContent>
    </Card>
  );
}
