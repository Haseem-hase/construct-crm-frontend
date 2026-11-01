'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { PageHeader } from '@/src/components/ui/page-header';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Select } from '@/src/components/ui/select';
import { FormField } from '@/src/components/ui/form-field';
import { Badge } from '@/src/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Pagination } from '@/src/components/ui/pagination';
import { Dialog } from '@/src/components/ui/dialog';
import { ConfirmationDialog } from '@/src/components/ui/confirmation-dialog';
import { InventoryAsset, InventoryAssetType } from '@/src/features/inventory/types/inventory.types';
import { inventoryApi } from '@/src/features/inventory/api/inventory.api';
import { InventoryError, InventoryLoading } from '@/src/features/inventory/components/inventory-ui';

type AssetForm = { type: InventoryAssetType; code: string; name: string; quantity: string; price: string; description: string; imageUrl: string };
const blankForm = (): AssetForm => ({ type: 'MATERIAL', code: '', name: '', quantity: '0', price: '0', description: '', imageUrl: '' });
const typeLabels: Record<InventoryAssetType, string> = { MATERIAL: 'Materials', TOOL: 'Tools', MACHINERY: 'Machinery' };
const errorMessage = (e: unknown) => (e as { response?: { data?: { message?: string; errors?: Array<{ message?: string }> } } })?.response?.data?.message || (e as { response?: { data?: { errors?: Array<{ message?: string }> } } })?.response?.data?.errors?.[0]?.message || 'Unable to complete this inventory request.';
const money = (value: string | number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'SAR', maximumFractionDigits: 2 }).format(Number(value));

export default function SimpleInventoryPage() {
  const [rows, setRows] = useState<InventoryAsset[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<'ALL' | InventoryAssetType>('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<InventoryAsset | null>(null);
  const [form, setForm] = useState<AssetForm>(blankForm());
  const [deleteTarget, setDeleteTarget] = useState<InventoryAsset | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const result = await inventoryApi.assets({ page, pageSize: 12, ...(filter === 'ALL' ? {} : { type: filter }), ...(search.trim() ? { search: search.trim() } : {}) });
      setRows(result.rows); setTotal(result.pagination.total); setTotalPages(result.pagination.totalPages);
    } catch (e) { setError(errorMessage(e)); } finally { setLoading(false); }
  }, [page, filter, search]);
  useEffect(() => { void load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm(blankForm()); setError(''); setDialogOpen(true); };
  const openEdit = (asset: InventoryAsset) => { setEditing(asset); setForm({ type: asset.type, code: asset.code, name: asset.name, quantity: String(asset.quantity), price: String(asset.price), description: asset.description || '', imageUrl: asset.imageUrl || '' }); setError(''); setDialogOpen(true); };
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true); setError('');
    const payload = { ...form, code: form.code.trim(), name: form.name.trim(), description: form.description.trim() || null, imageUrl: form.imageUrl.trim() || null };
    try { if (editing) await inventoryApi.updateAsset(editing.id, payload); else await inventoryApi.createAsset(payload); setDialogOpen(false); await load(); }
    catch (e) { setError(errorMessage(e)); } finally { setSaving(false); }
  };
  const remove = async () => { if (!deleteTarget) return; try { await inventoryApi.deleteAsset(deleteTarget.id); setDeleteTarget(null); await load(); } catch (e) { setError(errorMessage(e)); throw e; } };

  const tabs: Array<'ALL' | InventoryAssetType> = ['ALL', 'MATERIAL', 'TOOL', 'MACHINERY'];
  return <div className="space-y-6 pb-10">
    <PageHeader title="Inventory" description="Keep a simple record of the materials, tools, and machinery your company owns." action={<Button onClick={openCreate}>Add inventory <span className="ml-2">＋</span></Button>} />
    {error && !dialogOpen && <InventoryError message={error} onRetry={() => void load()} />}
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-neutral-200/70 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1 rounded-lg bg-neutral-100 p-1" role="tablist" aria-label="Inventory type">
          {tabs.map(tab => <button key={tab} type="button" role="tab" aria-selected={filter === tab} onClick={() => { setPage(1); setFilter(tab); }} className={`rounded-md px-3 py-2 text-xs font-medium transition-colors ${filter === tab ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-800'}`}>{tab === 'ALL' ? 'All items' : typeLabels[tab]}</button>)}
        </div>
        <Input className="sm:max-w-xs" value={search} onChange={e => { setPage(1); setSearch(e.target.value); }} placeholder="Search by code or name…" aria-label="Search inventory" />
      </div>
      {loading && !rows.length ? <div className="p-5"><InventoryLoading label="Loading your inventory…" /></div> : rows.length ? <>
        <Table><TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Count</TableHead><TableHead className="text-right">{filter === 'MATERIAL' ? 'Price per unit' : filter === 'ALL' ? 'Price' : 'Rent price'}</TableHead><TableHead>Description</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader><TableBody>
          {rows.map(asset => <TableRow key={asset.id}>
            <TableCell><div className="flex min-w-48 items-center gap-3">{asset.imageUrl ? <img src={asset.imageUrl} alt="" className="h-11 w-11 rounded-lg border border-neutral-200 object-cover" /> : <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-neutral-100 text-xs font-semibold text-neutral-400">{asset.name.slice(0, 1).toUpperCase()}</div>}<div className="min-w-0"><p className="truncate font-medium text-neutral-900">{asset.name}</p><p className="font-mono text-[11px] text-neutral-400">{asset.code}</p></div></div></TableCell>
            <TableCell><Badge variant={asset.type === 'MATERIAL' ? 'info' : asset.type === 'TOOL' ? 'neutral' : 'warning'}>{typeLabels[asset.type]}</Badge></TableCell>
            <TableCell className="text-right font-mono">{Number(asset.quantity).toLocaleString()}</TableCell>
            <TableCell className="text-right font-medium">{money(asset.price)}</TableCell>
            <TableCell className="max-w-64 truncate text-neutral-500">{asset.description || '—'}</TableCell>
            <TableCell><div className="flex justify-end gap-1"><Button size="sm" variant="ghost" onClick={() => openEdit(asset)}>Edit</Button><Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => setDeleteTarget(asset)}>Remove</Button></div></TableCell>
          </TableRow>)}
        </TableBody></Table><div className="border-t border-neutral-100 p-4"><Pagination currentPage={page} totalPages={totalPages} totalItems={total} itemsPerPage={12} onPageChange={setPage} /></div>
      </> : <div className="px-6 py-16 text-center"><p className="font-medium text-neutral-900">{search || filter !== 'ALL' ? 'No matching inventory' : 'Your inventory is empty'}</p><p className="mt-1 text-sm text-neutral-500">Add materials, tools, or machinery owned by your company.</p><Button className="mt-4" size="sm" onClick={openCreate}>Add first item</Button></div>}
    </Card>

    <Dialog open={dialogOpen} onOpenChange={open => { if (!saving) setDialogOpen(open); }} title={editing ? 'Edit inventory' : 'Add inventory'} description="Record an item owned by your construction company." panelClassName="relative mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-5 shadow-xl outline-none sm:p-7">
      <form onSubmit={submit} className="space-y-5">
        {error && <InventoryError message={error} />}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Inventory type" required><Select aria-label="Inventory type" value={form.type} onChange={type => setForm(current => ({ ...current, type: type as InventoryAssetType }))} options={tabs.filter((tab): tab is InventoryAssetType => tab !== 'ALL').map(type => ({ value: type, label: typeLabels[type].replace(/s$/, '') }))} /></FormField>
          <FormField label="Code" required><Input required maxLength={80} value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="e.g. CEM-001" /></FormField>
          <FormField label="Name" required><Input required maxLength={180} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Portland cement" /></FormField>
          <FormField label="Count" required><Input required type="number" min="0" step="0.0001" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} /></FormField>
          <FormField label={form.type === 'MATERIAL' ? 'Price per unit (SAR)' : 'Rent price (SAR)'} required><Input required type="number" min="0" step="0.0001" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></FormField>
          <FormField label="Image URL" helperText="Paste a link to an image hosted online."><Input type="url" maxLength={2048} value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://…" /></FormField>
        </div>
        {form.imageUrl && <img src={form.imageUrl} alt="Inventory item preview" className="h-36 w-36 rounded-xl border border-neutral-200 object-cover" onError={e => { e.currentTarget.style.display = 'none'; }} />}
        <FormField label="Description"><Textarea maxLength={2000} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Add useful specifications or notes" /></FormField>
        <div className="flex flex-col-reverse gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:justify-end"><Button type="button" variant="outline" disabled={saving} onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" isLoading={saving}>{editing ? 'Save changes' : 'Add to inventory'}</Button></div>
      </form>
    </Dialog>
    <ConfirmationDialog open={!!deleteTarget} onOpenChange={open => { if (!open) setDeleteTarget(null); }} title="Remove inventory item?" description={`${deleteTarget?.name || 'This item'} will be removed from your active company inventory.`} confirmLabel="Remove" variant="destructive" onConfirm={remove} />
  </div>;
}
