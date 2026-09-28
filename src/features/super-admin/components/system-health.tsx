import React from 'react';
import { SystemHealthItem } from '../types/super-admin.types';
import { Server, CheckCircle, AlertCircle } from '@/src/components/ui/icons';

export function SystemHealth({ data }: { data: SystemHealthItem[] }) {
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Operational':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Degraded':
      case 'Down':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-neutral-200/60 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-neutral-900 tracking-tight">System Health</h3>
          <p className="text-[13px] text-neutral-500 mt-1">Current platform service status.</p>
        </div>
        <Server className="w-5 h-5 text-neutral-400" />
      </div>
      
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.id} className="flex justify-between items-center py-2 border-b border-neutral-100 last:border-0">
            <div className="flex items-center space-x-3">
              {getStatusIcon(item.status)}
              <span className="text-[14px] font-medium text-neutral-800">{item.service}</span>
            </div>
            <div className="text-right">
              <span className={`text-[13px] font-medium ${item.status === 'Operational' ? 'text-green-600' : 'text-red-600'}`}>
                {item.status}
              </span>
              <p className="text-[11px] text-neutral-400 mt-0.5">Checked {item.lastChecked.toLowerCase()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
