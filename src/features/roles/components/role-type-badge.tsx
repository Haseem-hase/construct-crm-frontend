import React from 'react';
import { Badge } from '@/src/components/ui/badge';
import { RoleType } from '../types/roles.types';

export function RoleTypeBadge({ type }: { type: RoleType }) {
  if (type === 'GLOBAL') {
    return <Badge variant="neutral">Global Role</Badge>;
  }
  return <Badge variant="info">Custom Role</Badge>;
}
