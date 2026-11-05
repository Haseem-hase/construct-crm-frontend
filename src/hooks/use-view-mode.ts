'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ViewMode } from '@/src/components/ui/view-mode-toggle';

function readViewMode(): ViewMode {
  return new URLSearchParams(window.location.search).get('view') === 'grid' ? 'grid' : 'list';
}

export function useViewMode() {
  const [viewMode, setViewModeState] = useState<ViewMode>('list');

  useEffect(() => {
    const syncFromUrl = () => setViewModeState(readViewMode());
    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  const setViewMode = useCallback((mode: ViewMode) => {
    const url = new URL(window.location.href);
    if (mode === 'list') url.searchParams.delete('view');
    else url.searchParams.set('view', mode);
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    setViewModeState(mode);
  }, []);

  return [viewMode, setViewMode] as const;
}
