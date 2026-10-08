import React from 'react';
import { Badge } from '@/src/components/ui/badge';

export function RoleTypeBadge({ isGlobal }: { isGlobal: boolean }) {
  if (isGlobal) {
    return <Badge variant="neutral">Global Role</Badge>;
  }
  return <Badge variant="info">Custom Role</Badge>;
}
