import React from 'react';
import { PlatformAttentionItem } from '../types/super-admin.types';
import { AlertCircle, Info } from '@/src/components/ui/icons';

export function AttentionRequired({ data }: { data: PlatformAttentionItem[] }) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 border-red-100';
      case 'warning':
        return 'bg-amber-50 border-amber-100';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-neutral-200/60 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] h-full">
      <h3 className="text-base font-semibold text-neutral-900 mb-6 tracking-tight">Attention Required</h3>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.id} className={`flex items-start justify-between p-4 rounded-md border ${getBgColor(item.type)}`}>
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3 mt-0.5">
                {getIcon(item.type)}
              </div>
              <p className="text-[14px] text-neutral-800 font-medium leading-snug">{item.message}</p>
            </div>
            <button className="text-[12px] font-medium text-neutral-500 hover:text-neutral-900 whitespace-nowrap ml-4 transition-colors">
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
