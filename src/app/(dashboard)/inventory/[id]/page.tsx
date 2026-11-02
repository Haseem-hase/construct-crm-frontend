'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { InventoryError, InventoryLoading } from '@/src/features/inventory/components/inventory-ui';
import { inventoryApi } from '@/src/features/inventory/api/inventory.api';
import { InventoryAsset, InventoryAssetType } from '@/src/features/inventory/types/inventory.types';
import { inventoryImageUrl } from '@/src/features/inventory/utils/inventory-image';

const typeLabels: Record<InventoryAssetType, string> = {
  MATERIAL: 'Material',
  TOOL: 'Tool',
  MACHINERY: 'Machinery',
};

const money = (value: string | number) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: 'SAR', maximumFractionDigits: 2 }).format(Number(value));

const readableDate = (value: string) => new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date(value));

export default function InventoryAssetDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [asset, setAsset] = useState<InventoryAsset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    inventoryApi.asset(id)
      .then(result => { if (active) setAsset(result); })
      .catch(() => { if (active) setError('This inventory item could not be found or loaded.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) return <div className="mx-auto max-w-5xl py-8"><InventoryLoading label="Loading inventory item…" /></div>;

  if (error || !asset) {
    return <div className="mx-auto max-w-5xl space-y-5 py-6">
      <Link href="/inventory" className="text-sm font-medium text-neutral-500 hover:text-neutral-900">← Back to inventory</Link>
      <InventoryError message={error || 'This inventory item could not be found.'} />
    </div>;
  }

  const imageUrl = inventoryImageUrl(asset.imageUrl);

  return <main className="mx-auto max-w-5xl space-y-6 pb-12">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <Link href="/inventory" className="text-sm font-medium text-neutral-500 transition hover:text-neutral-900">← Back to inventory</Link>
        <div>
          <div className="mb-2 flex items-center gap-2"><Badge variant={asset.type === 'MATERIAL' ? 'info' : asset.type === 'TOOL' ? 'neutral' : 'warning'}>{typeLabels[asset.type]}</Badge><span className="font-mono text-xs text-neutral-400">{asset.code}</span></div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">{asset.name}</h1>
          <p className="mt-1 text-sm text-neutral-500">Inventory item details and current stock information.</p>
        </div>
      </div>
      <Link href="/inventory"><Button variant="outline">Back to list</Button></Link>
    </div>

    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
      <Card className="overflow-hidden">
        <div className="flex aspect-[4/3] min-h-64 items-center justify-center bg-neutral-50 sm:aspect-[16/10]">
          {imageUrl ? <img src={imageUrl} alt={asset.name} className="h-full w-full object-contain" /> : <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-neutral-300"><span className="text-6xl font-light">{asset.name.slice(0, 1).toUpperCase()}</span><span className="text-sm text-neutral-400">No photo available</span></div>}
        </div>
        {asset.description && <div className="border-t border-neutral-100 p-5 sm:p-6"><h2 className="text-sm font-semibold text-neutral-900">Description</h2><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-600">{asset.description}</p></div>}
      </Card>

      <div className="space-y-5">
        <Card className="p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-neutral-900">Stock and pricing</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-neutral-50 p-4"><p className="text-xs text-neutral-500">Quantity</p><p className="mt-1 text-xl font-semibold tabular-nums text-neutral-950">{Number(asset.quantity).toLocaleString()}</p></div>
            <div className="rounded-lg bg-neutral-50 p-4"><p className="text-xs text-neutral-500">{asset.type === 'MATERIAL' ? 'Price per unit' : 'Rent price'}</p><p className="mt-1 text-xl font-semibold tabular-nums text-neutral-950">{money(asset.price)}</p></div>
          </div>
          <dl className="mt-5 divide-y divide-neutral-100">
            <div className="flex justify-between gap-4 py-3 text-sm"><dt className="text-neutral-500">Inventory code</dt><dd className="font-mono font-medium text-neutral-800">{asset.code}</dd></div>
            <div className="flex justify-between gap-4 py-3 text-sm"><dt className="text-neutral-500">Type</dt><dd className="font-medium text-neutral-800">{typeLabels[asset.type]}</dd></div>
            <div className="flex justify-between gap-4 py-3 text-sm"><dt className="text-neutral-500">Added</dt><dd className="text-right text-neutral-700">{readableDate(asset.createdAt)}</dd></div>
            <div className="flex justify-between gap-4 py-3 text-sm"><dt className="text-neutral-500">Last updated</dt><dd className="text-right text-neutral-700">{readableDate(asset.updatedAt)}</dd></div>
          </dl>
        </Card>
        <div className="flex justify-end"><Link href="/inventory"><Button>Return to inventory</Button></Link></div>
      </div>
    </div>
  </main>;
}
