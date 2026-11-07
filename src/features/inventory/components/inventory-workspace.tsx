'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { InventoryAsset, InventoryAssetType, InventoryConditionReport, InventoryRequest, InventoryReturnRequest } from '@/src/features/inventory/types/inventory.types';
import { inventoryApi } from '@/src/features/inventory/api/inventory.api';
import type { InventoryWarehouse, WarehouseStock } from '@/src/features/inventory/types/inventory.types';
import { projectsApi, ApiProject } from '@/src/features/projects/api/projects.api';
import { labourAssignmentsApi, ApiLabourAssignment } from '@/src/features/labour-assignments/api/labour-assignments.api';
import { InventoryError, InventoryLoading } from '@/src/features/inventory/components/inventory-ui';
import { inventoryImageUrl } from '@/src/features/inventory/utils/inventory-image';

type AssetForm = { type: InventoryAssetType; code: string; name: string; quantity: string; price: string; description: string };
const blankForm = (): AssetForm => ({ type: 'MATERIAL', code: '', name: '', quantity: '0', price: '0', description: '' });
const typeLabels: Record<InventoryAssetType, string> = { MATERIAL: 'Materials', TOOL: 'Tools', MACHINERY: 'Machinery' };
const errorMessage = (e: unknown) => (e as { response?: { data?: { message?: string; errors?: Array<{ message?: string }> } } })?.response?.data?.message || (e as { response?: { data?: { errors?: Array<{ message?: string }> } } })?.response?.data?.errors?.[0]?.message || 'Unable to complete this inventory request.';
const money = (value: string | number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'SAR', maximumFractionDigits: 2 }).format(Number(value));

type InventorySection = 'items' | 'warehouses' | 'requests' | 'returns' | 'repairs';

export function InventoryWorkspace({ section }: { section: InventorySection }) {
  const router = useRouter();
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<InventoryAsset | null>(null);
  const [warehouses, setWarehouses] = useState<InventoryWarehouse[]>([]);
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [labourAssignments, setLabourAssignments] = useState<ApiLabourAssignment[]>([]);
  const [warehouseId, setWarehouseId] = useState('');
  const [warehouseStock, setWarehouseStock] = useState<WarehouseStock[]>([]);
  const [warehouseDialogOpen, setWarehouseDialogOpen] = useState(false);
  const [warehouseSaving, setWarehouseSaving] = useState(false);
  const [warehouseForm, setWarehouseForm] = useState({ code: '', name: '', type: 'CENTRAL' as 'CENTRAL' | 'PROJECT_SITE', projectId: '', address: '' });
  const [adjustTarget, setAdjustTarget] = useState<InventoryAsset | null>(null);
  const [adjustment, setAdjustment] = useState({ quantityDelta: '', reason: '' });
  const [adjustmentSaving, setAdjustmentSaving] = useState(false);
  const [requests, setRequests] = useState<InventoryRequest[]>([]);
  const [returns, setReturns] = useState<InventoryReturnRequest[]>([]);
  const [conditionReports, setConditionReports] = useState<InventoryConditionReport[]>([]);
  const [requestTarget, setRequestTarget] = useState<InventoryAsset | null>(null);
  const [requestForm, setRequestForm] = useState({ projectId: '', labourAssignmentId: '', quantity: '', purpose: '' });
  const [requestSaving, setRequestSaving] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<{ request: InventoryRequest; decision: 'APPROVE' | 'REJECT' } | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [reviewSaving, setReviewSaving] = useState(false);
  const [issuingId, setIssuingId] = useState('');
  const [returnTarget, setReturnTarget] = useState<{ request: InventoryRequest; lineId: string } | null>(null);
  const [returnForm, setReturnForm] = useState({ quantity: '', condition: 'GOOD' as 'GOOD' | 'DAMAGED' | 'REPAIR_REQUIRED' });
  const [returnSaving, setReturnSaving] = useState(false);
  const [returnReviewTarget, setReturnReviewTarget] = useState<InventoryReturnRequest | null>(null);
  const [returnReviewDecision, setReturnReviewDecision] = useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [returnReviewNote, setReturnReviewNote] = useState('');
  const [returnReviewSaving, setReturnReviewSaving] = useState(false);
  const [conditionTarget, setConditionTarget] = useState<{ request: InventoryRequest; lineId: string } | null>(null);
  const [conditionForm, setConditionForm] = useState({ quantity: '', description: '' });
  const [conditionSaving, setConditionSaving] = useState(false);
  const [conditionReviewTarget, setConditionReviewTarget] = useState<{ report: InventoryConditionReport; status: InventoryConditionReport['status'] } | null>(null);
  const [conditionReviewNote, setConditionReviewNote] = useState('');
  const [conditionReviewSaving, setConditionReviewSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (section === 'items' || section === 'warehouses') {
        const result = await inventoryApi.assets({ page, pageSize: 12, ...(filter === 'ALL' ? {} : { type: filter }), ...(search.trim() ? { search: search.trim() } : {}) });
        setRows(result.rows); setTotal(result.pagination.total); setTotalPages(result.pagination.totalPages);
        setWarehouseStock(await inventoryApi.warehouseStock({ ...(warehouseId ? { warehouseId } : {}), ...(search.trim() ? { search: search.trim() } : {}) }));
      } else if (section === 'requests') setRequests(await inventoryApi.requests());
      else if (section === 'returns') setReturns(await inventoryApi.returns());
      else setConditionReports(await inventoryApi.conditionReports());
      setError('');
    } catch (e) { setError(errorMessage(e)); }
    finally { setLoading(false); }
  }, [section, page, filter, search, warehouseId]);
  // Loading the server-backed inventory is the synchronization purpose of this effect.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    let active = true;
    Promise.all([inventoryApi.warehouses(), section === 'items' ? projectsApi.list().catch(() => []) : Promise.resolve([]), section === 'items' ? labourAssignmentsApi.list().catch(() => []) : Promise.resolve([])]).then(([warehouseRows, projectRows, labourRows]) => {
      if (!active) return;
      setWarehouses(warehouseRows);
      setProjects(projectRows);
      setLabourAssignments(labourRows);
      setWarehouseId(current => current || warehouseRows.find(row => row.isDefault)?.id || warehouseRows[0]?.id || '');
    }).catch(e => { if (active) setError(errorMessage(e)); });
    return () => { active = false; };
  }, [section]);
  useEffect(() => () => {
    if (imagePreview?.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const openCreate = () => { setEditing(null); setForm(blankForm()); setImageFile(null); setImagePreview(null); setError(''); setDialogOpen(true); };
  const openEdit = (asset: InventoryAsset) => { setEditing(asset); setForm({ type: asset.type, code: asset.code, name: asset.name, quantity: String(asset.quantity), price: String(asset.price), description: asset.description || '' }); setImageFile(null); setImagePreview(inventoryImageUrl(asset.imageUrl)); setError(''); setDialogOpen(true); };
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true); setError('');
    const payload = { ...form, code: form.code.trim(), name: form.name.trim(), description: form.description.trim() || null, ...(imageFile ? { image: imageFile } : {}) };
    try { if (editing) await inventoryApi.updateAsset(editing.id, payload); else await inventoryApi.createAsset(payload); setDialogOpen(false); await load(); }
    catch (e) { setError(errorMessage(e)); } finally { setSaving(false); }
  };
  const remove = async () => { if (!deleteTarget) return; try { await inventoryApi.deleteAsset(deleteTarget.id); setDeleteTarget(null); await load(); } catch (e) { setError(errorMessage(e)); throw e; } };

  const saveWarehouse = async (event: FormEvent) => {
    event.preventDefault(); setWarehouseSaving(true); setError('');
    try {
      const created = await inventoryApi.createWarehouse({
        code: warehouseForm.code.trim(), name: warehouseForm.name.trim(), type: warehouseForm.type,
        ...(warehouseForm.type === 'PROJECT_SITE' && warehouseForm.projectId ? { projectId: warehouseForm.projectId } : {}),
        address: warehouseForm.address.trim() || null,
      });
      setWarehouseDialogOpen(false); setWarehouseForm({ code: '', name: '', type: 'CENTRAL', projectId: '', address: '' });
      const updated = await inventoryApi.warehouses(); setWarehouses(updated); setWarehouseId(created.id);
    } catch (e) { setError(errorMessage(e)); } finally { setWarehouseSaving(false); }
  };

  const saveAdjustment = async (event: FormEvent) => {
    event.preventDefault(); if (!adjustTarget || !warehouseId) return;
    setAdjustmentSaving(true); setError('');
    try {
      await inventoryApi.adjustStock({ assetId: adjustTarget.id, warehouseId, quantityDelta: adjustment.quantityDelta, reason: adjustment.reason.trim() });
      setAdjustTarget(null); setAdjustment({ quantityDelta: '', reason: '' }); await load();
    } catch (e) { setError(errorMessage(e)); } finally { setAdjustmentSaving(false); }
  };

  const openRequest = (asset: InventoryAsset) => { setError(''); setRequestTarget(asset); setRequestForm({ projectId: '', labourAssignmentId: '', quantity: '', purpose: '' }); };
  const saveRequest = async (event: FormEvent) => {
    event.preventDefault(); if (!requestTarget || !warehouseId) return;
    setRequestSaving(true); setError('');
    try {
      await inventoryApi.createRequest({ warehouseId, projectId: requestForm.projectId, ...(requestForm.labourAssignmentId ? { labourAssignmentId: requestForm.labourAssignmentId } : {}), purpose: requestForm.purpose.trim(), lines: [{ assetId: requestTarget.id, quantity: requestForm.quantity }] });
      setRequestTarget(null); setRequestForm({ projectId: '', labourAssignmentId: '', quantity: '', purpose: '' }); await load();
    } catch (e) { setError(errorMessage(e)); } finally { setRequestSaving(false); }
  };

  const saveReview = async (event: FormEvent) => {
    event.preventDefault(); if (!reviewTarget) return;
    setReviewSaving(true); setError('');
    try {
      await inventoryApi.reviewRequest(reviewTarget.request.id, { decision: reviewTarget.decision, note: reviewNote.trim() || undefined });
      setReviewTarget(null); setReviewNote(''); await load();
    } catch (e) { setError(errorMessage(e)); } finally { setReviewSaving(false); }
  };

  const issueRequest = async (request: InventoryRequest) => {
    setIssuingId(request.id); setError('');
    try { await inventoryApi.issueRequest(request.id); await load(); }
    catch (e) { setError(errorMessage(e)); } finally { setIssuingId(''); }
  };

  const outstandingReturn = (request: InventoryRequest, lineId: string) => {
    const line = request.lines.find(item => item.id === lineId);
    if (!line) return 0;
    const pending = returns.filter(item => item.request.id === request.id && item.status === 'SUBMITTED')
      .flatMap(item => item.lines).filter(item => item.requestLine.id === lineId)
      .reduce((total, item) => total + Number(item.quantity), 0);
    return Math.max(0, Number(line.issuedQty) - Number(line.returnedQty) - pending);
  };

  const openReturn = (request: InventoryRequest) => {
    const line = request.lines.find(item => item.asset.type !== 'MATERIAL' && outstandingReturn(request, item.id) > 0);
    if (!line) return;
    setError(''); setReturnTarget({ request, lineId: line.id });
    setReturnForm({ quantity: String(outstandingReturn(request, line.id)), condition: 'GOOD' });
  };

  const saveReturn = async (event: FormEvent) => {
    event.preventDefault(); if (!returnTarget) return;
    setReturnSaving(true); setError('');
    try {
      await inventoryApi.createReturn({ requestId: returnTarget.request.id, lines: [{ requestLineId: returnTarget.lineId, quantity: returnForm.quantity, condition: returnForm.condition }] });
      setReturnTarget(null); await load();
    } catch (e) { setError(errorMessage(e)); } finally { setReturnSaving(false); }
  };

  const saveReturnReview = async (event: FormEvent) => {
    event.preventDefault(); if (!returnReviewTarget) return;
    setReturnReviewSaving(true); setError('');
    try {
      await inventoryApi.reviewReturn(returnReviewTarget.id, { decision: returnReviewDecision, note: returnReviewNote.trim() || undefined });
      setReturnReviewTarget(null); setReturnReviewNote(''); await load();
    } catch (e) { setError(errorMessage(e)); } finally { setReturnReviewSaving(false); }
  };

  const outstandingReport = (request: InventoryRequest, lineId: string) => {
    const line = request.lines.find(item => item.id === lineId);
    if (!line) return 0;
    const reported = conditionReports.filter(report => report.status === 'SUBMITTED' || report.status === 'UNDER_REVIEW' || report.status === 'IN_REPAIR')
      .filter(report => report.request?.id === request.id && report.requestLine?.id === line.id)
      .reduce((total, report) => total + Number(report.quantity), 0);
    return Math.max(0, Number(line.issuedQty) - Number(line.returnedQty) - reported);
  };

  const openConditionReport = (request: InventoryRequest) => {
    const line = request.lines.find(item => item.asset.type !== 'MATERIAL' && outstandingReport(request, item.id) > 0);
    if (!line) return;
    setError(''); setConditionTarget({ request, lineId: line.id });
    setConditionForm({ quantity: String(outstandingReport(request, line.id)), description: '' });
  };

  const saveConditionReport = async (event: FormEvent) => {
    event.preventDefault(); if (!conditionTarget) return;
    setConditionSaving(true); setError('');
    try {
      await inventoryApi.createConditionReport({ requestLineId: conditionTarget.lineId, quantity: conditionForm.quantity, description: conditionForm.description.trim() });
      setConditionTarget(null); await load();
    } catch (e) { setError(errorMessage(e)); } finally { setConditionSaving(false); }
  };

  const saveConditionReview = async (event: FormEvent) => {
    event.preventDefault(); if (!conditionReviewTarget) return;
    setConditionReviewSaving(true); setError('');
    try {
      await inventoryApi.updateConditionReport(conditionReviewTarget.report.id, { status: conditionReviewTarget.status, resolutionNote: conditionReviewNote.trim() || undefined });
      setConditionReviewTarget(null); setConditionReviewNote(''); await load();
    } catch (e) { setError(errorMessage(e)); } finally { setConditionReviewSaving(false); }
  };

  const stockByAsset = new Map(warehouseStock.map(stock => [stock.assetId, stock]));

  const tabs: Array<'ALL' | InventoryAssetType> = ['ALL', 'MATERIAL', 'TOOL', 'MACHINERY'];
  const sectionCopy: Record<InventorySection, { title: string; description: string }> = {
    items: { title: 'Inventory items', description: 'Browse materials, tools, and machinery owned by your organization.' },
    warehouses: { title: 'Warehouses & stock', description: 'Choose a location, review its available stock, and record stock adjustments.' },
    requests: { title: 'Stock requests', description: 'Review project requests, approve quantities, and record handovers.' },
    returns: { title: 'Returns & inspection', description: 'Inspect returned tools and machinery before stock becomes available again.' },
    repairs: { title: 'Damage & repairs', description: 'Track reported faults through inspection, repair, resolution, or write-off.' },
  };
  const showItems = section === 'items' || section === 'warehouses';
  return <div className="space-y-6 pb-10">
    <PageHeader title={sectionCopy[section].title} description={sectionCopy[section].description} action={section === 'warehouses' ? <Button variant="outline" onClick={() => setWarehouseDialogOpen(true)}>Add warehouse</Button> : section === 'items' ? <Button onClick={openCreate}>Add inventory <span className="ml-2">＋</span></Button> : undefined} />
    {error && !dialogOpen && !warehouseDialogOpen && !adjustTarget && !requestTarget && !reviewTarget && !returnTarget && !returnReviewTarget && !conditionTarget && !conditionReviewTarget && <InventoryError message={error} onRetry={() => void load()} />}
    {section === 'warehouses' && <Card className="grid gap-px overflow-hidden border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">{warehouses.map(warehouse => <button key={warehouse.id} type="button" onClick={() => setWarehouseId(warehouse.id)} className={`bg-white p-4 text-left transition-colors hover:bg-neutral-50 ${warehouse.id === warehouseId ? 'ring-1 ring-inset ring-neutral-900' : ''}`}><span className="block text-sm font-semibold text-neutral-900">{warehouse.name}{warehouse.isDefault && <span className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600">Main</span>}</span><span className="mt-1 block text-xs text-neutral-500">{warehouse.type === 'PROJECT_SITE' ? warehouse.project?.name || 'Project site' : 'Central warehouse'} · {warehouse._count?.stocks ?? 0} stocked items</span></button>)}{!warehouses.length && <div className="bg-white p-5 text-sm text-neutral-500">No warehouses yet. Add a warehouse to organize your stock.</div>}</Card>}
    {showItems && <Card className="overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-neutral-200/70 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        {section === 'warehouses' && <div className="flex items-center gap-2"><span className="text-xs font-medium text-neutral-500">Location</span><select className="h-9 min-w-48 rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none focus:border-neutral-400" aria-label="Select warehouse" value={warehouseId} onChange={event => setWarehouseId(event.target.value)}>{warehouses.map(warehouse => <option key={warehouse.id} value={warehouse.id}>{warehouse.name}{warehouse.isDefault ? ' · Main' : ''}</option>)}</select></div>}
        <div className="flex flex-wrap gap-1 rounded-lg bg-neutral-100 p-1" role="tablist" aria-label="Inventory type">
          {tabs.map(tab => <button key={tab} type="button" role="tab" aria-selected={filter === tab} onClick={() => { setPage(1); setFilter(tab); }} className={`rounded-md px-3 py-2 text-xs font-medium transition-colors ${filter === tab ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-800'}`}>{tab === 'ALL' ? 'All items' : typeLabels[tab]}</button>)}
        </div>
        <Input className="sm:max-w-xs" value={search} onChange={e => { setPage(1); setSearch(e.target.value); }} placeholder="Search by code or name…" aria-label="Search inventory" />
      </div>
      {loading && !rows.length ? <div className="p-5"><InventoryLoading label="Loading your inventory…" /></div> : rows.length ? <>
        <Table><TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Type</TableHead>{section === 'warehouses' && <><TableHead className="text-right">On hand</TableHead><TableHead className="text-right">Available</TableHead></>}<TableHead className="text-right">{filter === 'MATERIAL' ? 'Price per unit' : filter === 'ALL' ? 'Price' : 'Rent price'}</TableHead><TableHead>Description</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader><TableBody>
          {rows.map(asset => <TableRow key={asset.id}>
            <TableCell><div className="flex min-w-48 items-center gap-3">{inventoryImageUrl(asset.imageUrl) ? <img src={inventoryImageUrl(asset.imageUrl)!} alt={`${asset.name}`} className="h-11 w-11 rounded-lg border border-neutral-200 object-cover" /> : <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-neutral-100 text-xs font-semibold text-neutral-400">{asset.name.slice(0, 1).toUpperCase()}</div>}<div className="min-w-0"><p className="truncate font-medium text-neutral-900">{asset.name}</p><p className="font-mono text-[11px] text-neutral-400">{asset.code}</p></div></div></TableCell>
            <TableCell><Badge variant={asset.type === 'MATERIAL' ? 'info' : asset.type === 'TOOL' ? 'neutral' : 'warning'}>{typeLabels[asset.type]}</Badge></TableCell>
            {section === 'warehouses' && <><TableCell className="text-right font-mono">{Number(stockByAsset.get(asset.id)?.onHandQty ?? 0).toLocaleString()}</TableCell><TableCell className="text-right font-mono">{Number(stockByAsset.get(asset.id)?.availableQty ?? 0).toLocaleString()}</TableCell></>}
            <TableCell className="text-right font-medium">{money(asset.price)}</TableCell>
            <TableCell className="max-w-64 truncate text-neutral-500">{asset.description || '—'}</TableCell>
            <TableCell><div className="flex justify-end gap-1">{section === 'warehouses' ? <><Button size="sm" variant="ghost" onClick={() => openRequest(asset)}>Request</Button><Button size="sm" variant="ghost" onClick={() => setAdjustTarget(asset)}>Adjust stock</Button></> : <><Button size="sm" variant="ghost" onClick={() => router.push(`/inventory/${asset.id}`)}>View</Button><Button size="sm" variant="ghost" onClick={() => openEdit(asset)}>Edit</Button><Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => setDeleteTarget(asset)}>Remove</Button></>}</div></TableCell>
          </TableRow>)}
        </TableBody></Table><div className="border-t border-neutral-100 p-4"><Pagination currentPage={page} totalPages={totalPages} totalItems={total} itemsPerPage={12} onPageChange={setPage} /></div>
      </> : <div className="px-6 py-16 text-center"><p className="font-medium text-neutral-900">{search || filter !== 'ALL' ? 'No matching inventory' : section === 'warehouses' ? 'No stock at this warehouse' : 'Your inventory is empty'}</p><p className="mt-1 text-sm text-neutral-500">{section === 'warehouses' ? 'Choose another warehouse or add stock to this location.' : 'Add materials, tools, or machinery owned by your company.'}</p>{section === 'items' && <Button className="mt-4" size="sm" onClick={openCreate}>Add first item</Button>}</div>}
    </Card>}

    {section === 'requests' && <Card className="overflow-hidden">
      <div className="flex flex-col gap-1 border-b border-neutral-200/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-sm font-semibold text-neutral-900">Stock requests</h2><p className="mt-1 text-xs text-neutral-500">Review project requests and record approved stock handovers.</p></div><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">{requests.filter(request => request.status === 'SUBMITTED').length} awaiting review</span></div>
      {requests.length ? <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Request</TableHead><TableHead>Project</TableHead><TableHead>Items</TableHead><TableHead>Requested by</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>
        {requests.map(request => <TableRow key={request.id}><TableCell><span className="font-mono text-xs font-semibold text-neutral-800">{request.referenceNumber}</span><span className="mt-1 block text-xs text-neutral-500">{new Date(request.submittedAt).toLocaleDateString()}</span></TableCell><TableCell><span className="font-medium text-neutral-800">{request.project.name}</span><span className="mt-1 block font-mono text-xs text-neutral-500">{request.project.projectCode}</span>{request.requestedForLabourAssignment && <span className="mt-1 block text-xs text-neutral-600">For {request.requestedForLabourAssignment.labour.fullName} · {request.requestedForLabourAssignment.assignment.contractor.fullName}</span>}</TableCell><TableCell>{request.lines.map(line => <div key={line.id} className="text-sm text-neutral-800">{line.asset.name} <span className="font-mono text-xs text-neutral-500">× {Number(line.requestedQty).toLocaleString()}</span></div>)}</TableCell><TableCell><span className="text-sm text-neutral-700">{request.requestedBy.fullName}</span></TableCell><TableCell><Badge variant={request.status === 'APPROVED' ? 'info' : request.status === 'SUBMITTED' ? 'warning' : request.status === 'ISSUED' ? 'success' : request.status === 'REJECTED' ? 'destructive' : 'neutral'}>{request.status.replaceAll('_', ' ')}</Badge>{request.reviewNote && <span className="mt-1 block max-w-48 truncate text-xs text-neutral-500" title={request.reviewNote}>{request.reviewNote}</span>}</TableCell><TableCell><div className="flex justify-end gap-1">{request.status === 'SUBMITTED' && <><Button size="sm" variant="outline" onClick={() => { setReviewNote(''); setReviewTarget({ request, decision: 'REJECT' }); }}>Reject</Button><Button size="sm" onClick={() => { setReviewNote(''); setReviewTarget({ request, decision: 'APPROVE' }); }}>Approve</Button></>}{request.status === 'APPROVED' && <Button size="sm" isLoading={issuingId === request.id} onClick={() => void issueRequest(request)}>Record issue</Button>}{(request.status === 'ISSUED' || request.status === 'PARTIALLY_RETURNED') && request.lines.some(line => line.asset.type !== 'MATERIAL' && outstandingReturn(request, line.id) > 0) && <><Button size="sm" variant="outline" onClick={() => openReturn(request)}>Request return</Button>{request.lines.some(line => line.asset.type !== 'MATERIAL' && outstandingReport(request, line.id) > 0) && <Button size="sm" variant="ghost" onClick={() => openConditionReport(request)}>Report issue</Button>}</>}</div></TableCell></TableRow>)}
      </TableBody></Table></div> : <div className="px-6 py-10 text-center text-sm text-neutral-500">No stock requests yet.</div>}
    </Card>}

    {section === 'returns' && <Card className="overflow-hidden">
      <div className="flex flex-col gap-1 border-b border-neutral-200/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-sm font-semibold text-neutral-900">Returns and inspection</h2><p className="mt-1 text-xs text-neutral-500">Inspect returned tools and machinery before stock becomes available again.</p></div><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">{returns.filter(item => item.status === 'SUBMITTED').length} awaiting inspection</span></div>
      {returns.length ? <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Return</TableHead><TableHead>Original request</TableHead><TableHead>Item and condition</TableHead><TableHead>Returned by</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>
        {returns.map(returnRequest => <TableRow key={returnRequest.id}><TableCell><span className="font-mono text-xs font-semibold text-neutral-800">{returnRequest.referenceNumber}</span><span className="mt-1 block text-xs text-neutral-500">{new Date(returnRequest.submittedAt).toLocaleDateString()}</span></TableCell><TableCell><span className="font-mono text-xs text-neutral-700">{returnRequest.request.referenceNumber}</span><span className="mt-1 block text-xs text-neutral-500">{returnRequest.request.project.name}</span></TableCell><TableCell>{returnRequest.lines.map(line => <div key={line.id} className="text-sm text-neutral-800">{line.requestLine.asset.name} <span className="font-mono text-xs text-neutral-500">× {Number(line.quantity).toLocaleString()}</span><span className="ml-2 text-xs text-neutral-500">{(line.condition || 'GOOD').replaceAll('_', ' ')}</span></div>)}</TableCell><TableCell><span className="text-sm text-neutral-700">{returnRequest.requestedBy.fullName}</span></TableCell><TableCell><Badge variant={returnRequest.status === 'SUBMITTED' ? 'warning' : returnRequest.status === 'RECEIVED' ? 'success' : returnRequest.status === 'REJECTED' ? 'destructive' : 'neutral'}>{returnRequest.status.replaceAll('_', ' ')}</Badge>{returnRequest.reviewNote && <span className="mt-1 block max-w-48 truncate text-xs text-neutral-500" title={returnRequest.reviewNote}>{returnRequest.reviewNote}</span>}</TableCell><TableCell><div className="flex justify-end gap-1">{returnRequest.status === 'SUBMITTED' && <><Button size="sm" variant="outline" onClick={() => { setReturnReviewDecision('REJECT'); setReturnReviewNote(''); setReturnReviewTarget(returnRequest); }}>Reject</Button><Button size="sm" onClick={() => { setReturnReviewDecision('APPROVE'); setReturnReviewNote(''); setReturnReviewTarget(returnRequest); }}>Inspect & accept</Button></>}</div></TableCell></TableRow>)}
      </TableBody></Table></div> : <div className="px-6 py-10 text-center text-sm text-neutral-500">No return requests yet.</div>}
    </Card>}

    {section === 'repairs' && <Card className="overflow-hidden">
      <div className="flex flex-col gap-1 border-b border-neutral-200/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-sm font-semibold text-neutral-900">Damage and repair reports</h2><p className="mt-1 text-xs text-neutral-500">Track faults through review, repair, resolution, or write-off.</p></div><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">{conditionReports.filter(report => report.status === 'SUBMITTED' || report.status === 'UNDER_REVIEW' || report.status === 'IN_REPAIR').length} open</span></div>
      {conditionReports.length ? <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Reported</TableHead><TableHead>Item</TableHead><TableHead>Project / request</TableHead><TableHead>Quantity and issue</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>
        {conditionReports.map(report => <TableRow key={report.id}><TableCell><span className="text-sm text-neutral-700">{new Date(report.createdAt).toLocaleDateString()}</span><span className="mt-1 block text-xs text-neutral-500">{report.reportedBy.fullName}</span></TableCell><TableCell><span className="font-medium text-neutral-800">{report.asset.name}</span><span className="mt-1 block font-mono text-xs text-neutral-500">{report.asset.code}</span></TableCell><TableCell>{report.request ? <><span className="text-sm text-neutral-700">{report.request.project.name}</span><span className="mt-1 block font-mono text-xs text-neutral-500">{report.request.referenceNumber}</span></> : <span className="text-sm text-neutral-400">—</span>}</TableCell><TableCell><span className="font-mono text-xs text-neutral-700">× {Number(report.quantity).toLocaleString()}</span><p className="mt-1 max-w-72 text-xs leading-5 text-neutral-600">{report.description}</p></TableCell><TableCell><Badge variant={report.status === 'SUBMITTED' || report.status === 'UNDER_REVIEW' ? 'warning' : report.status === 'IN_REPAIR' ? 'info' : report.status === 'WRITTEN_OFF' ? 'destructive' : 'success'}>{report.status.replaceAll('_', ' ')}</Badge>{report.resolutionNote && <span className="mt-1 block max-w-48 truncate text-xs text-neutral-500" title={report.resolutionNote}>{report.resolutionNote}</span>}</TableCell><TableCell><div className="flex justify-end gap-1">{report.status === 'SUBMITTED' && <Button size="sm" onClick={() => { setConditionReviewNote(''); setConditionReviewTarget({ report, status: 'UNDER_REVIEW' }); }}>Start review</Button>}{report.status === 'UNDER_REVIEW' && <Button size="sm" onClick={() => { setConditionReviewNote(''); setConditionReviewTarget({ report, status: 'IN_REPAIR' }); }}>Send to repair</Button>}{report.status === 'IN_REPAIR' && <><Button size="sm" variant="outline" onClick={() => { setConditionReviewNote(''); setConditionReviewTarget({ report, status: 'WRITTEN_OFF' }); }}>Write off</Button><Button size="sm" onClick={() => { setConditionReviewNote(''); setConditionReviewTarget({ report, status: 'RESOLVED' }); }}>Mark repaired</Button></>}</div></TableCell></TableRow>)}
      </TableBody></Table></div> : <div className="px-6 py-10 text-center text-sm text-neutral-500">No damage reports yet.</div>}
    </Card>}

    <Dialog open={dialogOpen} onOpenChange={open => { if (!saving) setDialogOpen(open); }} title={editing ? 'Edit inventory' : 'Add inventory'} description="Record an item owned by your construction company." panelClassName="relative mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-5 shadow-xl outline-none sm:p-7">
      <form onSubmit={submit} className="space-y-5">
        {error && <InventoryError message={error} />}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Inventory type" required><Select aria-label="Inventory type" value={form.type} onChange={type => setForm(current => ({ ...current, type: type as InventoryAssetType }))} options={tabs.filter((tab): tab is InventoryAssetType => tab !== 'ALL').map(type => ({ value: type, label: typeLabels[type].replace(/s$/, '') }))} /></FormField>
          <FormField label="Code" required><Input required maxLength={80} value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="e.g. CEM-001" /></FormField>
          <FormField label="Name" required><Input required maxLength={180} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Portland cement" /></FormField>
          <FormField label="Opening count" required helperText={editing ? 'Use Adjust stock to record quantity changes at a specific warehouse.' : 'Opening quantity will be added to the main warehouse.'}><Input required type="number" min="0" step="0.0001" disabled={!!editing} value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} /></FormField>
          <FormField label={form.type === 'MATERIAL' ? 'Price per unit (SAR)' : 'Rent price (SAR)'} required><Input required type="number" min="0" step="0.0001" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></FormField>
        </div>
        <FormField label="Item photo" helperText="JPEG, PNG, or WebP · up to 5 MB. A square image works best.">
          <div className="flex flex-col gap-4 rounded-xl border border-dashed border-neutral-300 bg-neutral-50/70 p-4 sm:flex-row sm:items-center">
            {imagePreview ? <img src={imagePreview} alt="Inventory item preview" className="h-24 w-24 shrink-0 rounded-lg border border-neutral-200 bg-white object-cover" /> : <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-400"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg></div>}
            <div className="min-w-0 flex-1"><p className="text-sm font-medium text-neutral-800">{imageFile ? imageFile.name : imagePreview ? 'Current item photo' : 'Add a clear photo'}</p><p className="mt-1 text-xs leading-5 text-neutral-500">Show the material, tool, or machine so your team can identify it at a glance.</p><label className="mt-3 inline-flex cursor-pointer items-center rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 shadow-sm transition hover:border-neutral-300 hover:bg-neutral-50">{imagePreview ? 'Choose another photo' : 'Choose photo'}<input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={event => { const file = event.target.files?.[0]; if (!file) return; if (file.size > 5 * 1024 * 1024) { setError('Choose an image smaller than 5 MB.'); event.currentTarget.value = ''; return; } setError(''); setImageFile(file); setImagePreview(URL.createObjectURL(file)); }} /></label></div>
          </div>
        </FormField>
        <FormField label="Description"><Textarea maxLength={2000} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Add useful specifications or notes" /></FormField>
        <div className="flex flex-col-reverse gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:justify-end"><Button type="button" variant="outline" disabled={saving} onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" isLoading={saving}>{editing ? 'Save changes' : 'Add to inventory'}</Button></div>
      </form>
    </Dialog>
    <Dialog open={warehouseDialogOpen} onOpenChange={open => { if (!warehouseSaving) setWarehouseDialogOpen(open); }} title="Add warehouse" description="Create a stock location for this organization." panelClassName="relative mx-4 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-5 shadow-xl outline-none sm:p-7">
      <form onSubmit={saveWarehouse} className="space-y-5">
        {error && <InventoryError message={error} />}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Warehouse name" required><Input required maxLength={180} value={warehouseForm.name} onChange={event => setWarehouseForm(current => ({ ...current, name: event.target.value }))} placeholder="e.g. Riyadh Main Store" /></FormField>
          <FormField label="Warehouse code" required><Input required maxLength={80} value={warehouseForm.code} onChange={event => setWarehouseForm(current => ({ ...current, code: event.target.value }))} placeholder="e.g. RUH-MAIN" /></FormField>
          <FormField label="Warehouse type" required><Select aria-label="Warehouse type" value={warehouseForm.type} onChange={value => setWarehouseForm(current => ({ ...current, type: value as 'CENTRAL' | 'PROJECT_SITE' }))} options={[{ value: 'CENTRAL', label: 'Central warehouse' }, { value: 'PROJECT_SITE', label: 'Project site store' }]} /></FormField>
          {warehouseForm.type === 'PROJECT_SITE' && <FormField label="Project" required><Select aria-label="Project served by warehouse" value={warehouseForm.projectId} onChange={value => setWarehouseForm(current => ({ ...current, projectId: value }))} options={[{ value: '', label: 'Select project' }, ...projects.map(project => ({ value: project.id, label: `${project.name} (${project.projectCode})` }))]} /></FormField>}
        </div>
        <FormField label="Address"><Input maxLength={500} value={warehouseForm.address} onChange={event => setWarehouseForm(current => ({ ...current, address: event.target.value }))} placeholder="Optional location or address" /></FormField>
        <div className="flex flex-col-reverse gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:justify-end"><Button type="button" variant="outline" disabled={warehouseSaving} onClick={() => setWarehouseDialogOpen(false)}>Cancel</Button><Button type="submit" isLoading={warehouseSaving}>Create warehouse</Button></div>
      </form>
    </Dialog>
    <Dialog open={!!adjustTarget} onOpenChange={open => { if (!adjustmentSaving && !open) setAdjustTarget(null); }} title="Adjust warehouse stock" description={adjustTarget ? `${adjustTarget.name} · ${warehouses.find(row => row.id === warehouseId)?.name || 'Selected warehouse'}` : ''} panelClassName="relative mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-5 shadow-xl outline-none sm:p-7">
      <form onSubmit={saveAdjustment} className="space-y-5">
        {error && <InventoryError message={error} />}
        <FormField label="Quantity change" helperText="Use a positive number to receive stock or a negative number to record stock leaving the warehouse." required><Input required type="number" step="0.0001" value={adjustment.quantityDelta} onChange={event => setAdjustment(current => ({ ...current, quantityDelta: event.target.value }))} placeholder="e.g. 100 or -5" /></FormField>
        <FormField label="Reason" required><Textarea required maxLength={500} value={adjustment.reason} onChange={event => setAdjustment(current => ({ ...current, reason: event.target.value }))} placeholder="Purchase receipt, damaged stock, correction…" /></FormField>
        <div className="flex flex-col-reverse gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:justify-end"><Button type="button" variant="outline" disabled={adjustmentSaving} onClick={() => setAdjustTarget(null)}>Cancel</Button><Button type="submit" isLoading={adjustmentSaving}>Save adjustment</Button></div>
      </form>
    </Dialog>
    <Dialog open={!!requestTarget} onOpenChange={open => { if (!requestSaving && !open) setRequestTarget(null); }} title="Request inventory" description={requestTarget ? `Request ${requestTarget.name} from ${warehouses.find(row => row.id === warehouseId)?.name || 'the selected warehouse'}. Stock changes only after approval and issue.` : ''} panelClassName="relative mx-4 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-5 shadow-xl outline-none sm:p-7">
      <form onSubmit={saveRequest} className="space-y-5">
        {error && <InventoryError message={error} />}
        {requestTarget && <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3"><div className="flex items-center justify-between gap-4"><span className="text-sm font-medium text-neutral-800">Available at this warehouse</span><span className="font-mono text-sm font-semibold text-neutral-900">{Number(stockByAsset.get(requestTarget.id)?.availableQty ?? 0).toLocaleString()}</span></div></div>}
        <FormField label="Project" required><Select aria-label="Request project" value={requestForm.projectId} onChange={value => setRequestForm(current => ({ ...current, projectId: value, labourAssignmentId: '' }))} options={[{ value: '', label: 'Select the project' }, ...projects.map(project => ({ value: project.id, label: `${project.name} (${project.projectCode})` }))]} /></FormField>
        <FormField label="For labourer" helperText="Optional. Only active labour assignments for this project are shown."><Select aria-label="Labourer this request is for" value={requestForm.labourAssignmentId} disabled={!requestForm.projectId} onChange={value => setRequestForm(current => ({ ...current, labourAssignmentId: value }))} options={[{ value: '', label: 'No specific labourer' }, ...labourAssignments.filter(assignment => assignment.status === 'ACTIVE' && assignment.assignment.project.id === requestForm.projectId).map(assignment => ({ value: assignment.id, label: `${assignment.labour.fullName} · ${assignment.assignment.contractor.fullName}` }))]} /></FormField>
        <FormField label="Quantity" required><Input required type="number" min="0.0001" step="0.0001" value={requestForm.quantity} onChange={event => setRequestForm(current => ({ ...current, quantity: event.target.value }))} /></FormField>
        <FormField label="Purpose" helperText="Add context for the team reviewing this request."><Textarea maxLength={1000} value={requestForm.purpose} onChange={event => setRequestForm(current => ({ ...current, purpose: event.target.value }))} placeholder="Describe where this item will be used" /></FormField>
        <div className="flex flex-col-reverse gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:justify-end"><Button type="button" variant="outline" disabled={requestSaving} onClick={() => setRequestTarget(null)}>Cancel</Button><Button type="submit" isLoading={requestSaving} disabled={!projects.length || !warehouseId}>Submit request</Button></div>
      </form>
    </Dialog>
    <Dialog open={!!reviewTarget} onOpenChange={open => { if (!reviewSaving && !open) setReviewTarget(null); }} title={reviewTarget?.decision === 'APPROVE' ? 'Approve stock request' : 'Reject stock request'} description={reviewTarget ? `${reviewTarget.request.referenceNumber} · ${reviewTarget.request.project.name}` : ''} panelClassName="relative mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-5 shadow-xl outline-none sm:p-7">
      <form onSubmit={saveReview} className="space-y-5">
        {error && <InventoryError message={error} />}
        {reviewTarget && <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">{reviewTarget.request.lines.map(line => <div key={line.id} className="flex justify-between gap-3 py-1"><span>{line.asset.name}</span><span className="font-mono">× {Number(line.requestedQty).toLocaleString()}</span></div>)}</div>}
        <FormField label={reviewTarget?.decision === 'APPROVE' ? 'Approval note' : 'Reason for rejection'} required={reviewTarget?.decision === 'REJECT'}><Textarea required={reviewTarget?.decision === 'REJECT'} maxLength={1000} value={reviewNote} onChange={event => setReviewNote(event.target.value)} placeholder={reviewTarget?.decision === 'APPROVE' ? 'Optional note for the requester' : 'Explain why this request is being declined'} /></FormField>
        <div className="flex flex-col-reverse gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:justify-end"><Button type="button" variant="outline" disabled={reviewSaving} onClick={() => setReviewTarget(null)}>Cancel</Button><Button type="submit" isLoading={reviewSaving} variant={reviewTarget?.decision === 'REJECT' ? 'destructive' : 'primary'}>{reviewTarget?.decision === 'APPROVE' ? 'Approve request' : 'Reject request'}</Button></div>
      </form>
    </Dialog>
    <Dialog open={!!returnTarget} onOpenChange={open => { if (!returnSaving && !open) setReturnTarget(null); }} title="Request equipment return" description={returnTarget ? `${returnTarget.request.referenceNumber} · ${returnTarget.request.project.name}` : ''} panelClassName="relative mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-5 shadow-xl outline-none sm:p-7">
      <form onSubmit={saveReturn} className="space-y-5">
        {error && <InventoryError message={error} />}
        {returnTarget && (() => {
          const line = returnTarget.request.lines.find(item => item.id === returnTarget.lineId);
          return line ? <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3"><p className="text-sm font-medium text-neutral-800">{line.asset.name}</p><p className="mt-1 text-xs text-neutral-500">Still out: {outstandingReturn(returnTarget.request, line.id).toLocaleString()}</p></div> : null;
        })()}
        <FormField label="Quantity to return" required><Input required type="number" min="0.0001" max={returnTarget ? outstandingReturn(returnTarget.request, returnTarget.lineId) : undefined} step="0.0001" value={returnForm.quantity} onChange={event => setReturnForm(current => ({ ...current, quantity: event.target.value }))} /></FormField>
        <FormField label="Condition on return" required><Select aria-label="Condition on return" value={returnForm.condition} onChange={value => setReturnForm(current => ({ ...current, condition: value as 'GOOD' | 'DAMAGED' | 'REPAIR_REQUIRED' }))} options={[{ value: 'GOOD', label: 'Good condition' }, { value: 'DAMAGED', label: 'Damaged' }, { value: 'REPAIR_REQUIRED', label: 'Needs repair' }]} /></FormField>
        <p className="rounded-lg bg-sky-50 px-3 py-2 text-xs leading-5 text-sky-800">Returned quantity is added back only after the authorized team inspects and accepts it. Damaged items are held out of available stock for maintenance.</p>
        <div className="flex flex-col-reverse gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:justify-end"><Button type="button" variant="outline" disabled={returnSaving} onClick={() => setReturnTarget(null)}>Cancel</Button><Button type="submit" isLoading={returnSaving}>Submit return</Button></div>
      </form>
    </Dialog>
    <Dialog open={!!returnReviewTarget} onOpenChange={open => { if (!returnReviewSaving && !open) setReturnReviewTarget(null); }} title={returnReviewDecision === 'APPROVE' ? 'Inspect and accept return' : 'Reject return request'} description={returnReviewTarget ? `${returnReviewTarget.referenceNumber} · ${returnReviewTarget.request.project.name}` : ''} panelClassName="relative mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-5 shadow-xl outline-none sm:p-7">
      <form onSubmit={saveReturnReview} className="space-y-5">
        {error && <InventoryError message={error} />}
        {returnReviewTarget && <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">{returnReviewTarget.lines.map(line => <div key={line.id} className="flex justify-between gap-3 py-1"><span>{line.requestLine.asset.name} · {(line.condition || 'GOOD').replaceAll('_', ' ')}</span><span className="font-mono">× {Number(line.quantity).toLocaleString()}</span></div>)}</div>}
        <FormField label={returnReviewDecision === 'APPROVE' ? 'Inspection note' : 'Reason for rejection'} required={returnReviewDecision === 'REJECT'}><Textarea required={returnReviewDecision === 'REJECT'} maxLength={1000} value={returnReviewNote} onChange={event => setReturnReviewNote(event.target.value)} placeholder={returnReviewDecision === 'APPROVE' ? 'Optional note about the inspection' : 'Explain why the return cannot be accepted'} /></FormField>
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">Accepting the return updates warehouse stock immediately. Items marked damaged or needing repair will remain unavailable.</p>
        <div className="flex flex-col-reverse gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:justify-end"><Button type="button" variant="outline" disabled={returnReviewSaving} onClick={() => setReturnReviewTarget(null)}>Cancel</Button><Button type="submit" isLoading={returnReviewSaving} variant={returnReviewDecision === 'REJECT' ? 'destructive' : 'primary'}>{returnReviewDecision === 'APPROVE' ? 'Accept inspected return' : 'Reject return'}</Button></div>
      </form>
    </Dialog>
    <Dialog open={!!conditionTarget} onOpenChange={open => { if (!conditionSaving && !open) setConditionTarget(null); }} title="Report damaged equipment" description={conditionTarget ? `${conditionTarget.request.referenceNumber} · ${conditionTarget.request.project.name}` : ''} panelClassName="relative mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-5 shadow-xl outline-none sm:p-7">
      <form onSubmit={saveConditionReport} className="space-y-5">
        {error && <InventoryError message={error} />}
        {conditionTarget && <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3"><p className="text-sm font-medium text-neutral-800">{conditionTarget.request.lines.find(line => line.id === conditionTarget.lineId)?.asset.name}</p><p className="mt-1 text-xs text-neutral-500">Still issued: {outstandingReport(conditionTarget.request, conditionTarget.lineId).toLocaleString()}</p></div>}
        <FormField label="Affected quantity" required><Input required type="number" min="0.0001" max={conditionTarget ? outstandingReport(conditionTarget.request, conditionTarget.lineId) : undefined} step="0.0001" value={conditionForm.quantity} onChange={event => setConditionForm(current => ({ ...current, quantity: event.target.value }))} /></FormField>
        <FormField label="Describe the fault or damage" required helperText="Include visible damage, symptoms, and when the issue was noticed."><Textarea required minLength={5} maxLength={2000} value={conditionForm.description} onChange={event => setConditionForm(current => ({ ...current, description: event.target.value }))} placeholder="Describe what happened and what needs attention" /></FormField>
        <div className="flex flex-col-reverse gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:justify-end"><Button type="button" variant="outline" disabled={conditionSaving} onClick={() => setConditionTarget(null)}>Cancel</Button><Button type="submit" isLoading={conditionSaving}>Submit report</Button></div>
      </form>
    </Dialog>
    <Dialog open={!!conditionReviewTarget} onOpenChange={open => { if (!conditionReviewSaving && !open) setConditionReviewTarget(null); }} title={conditionReviewTarget ? ({ SUBMITTED: 'Review submitted report', UNDER_REVIEW: 'Start report review', IN_REPAIR: 'Send item to repair', RESOLVED: 'Mark repair complete', WRITTEN_OFF: 'Write off damaged item' }[conditionReviewTarget.status]) : ''} description={conditionReviewTarget ? `${conditionReviewTarget.report.asset.name} · ${conditionReviewTarget.report.request?.project.name || conditionReviewTarget.report.warehouse.name}` : ''} panelClassName="relative mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-5 shadow-xl outline-none sm:p-7">
      <form onSubmit={saveConditionReview} className="space-y-5">
        {error && <InventoryError message={error} />}
        {conditionReviewTarget && <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700"><p>{conditionReviewTarget.report.description}</p><p className="mt-2 font-mono text-xs text-neutral-500">Affected quantity: {Number(conditionReviewTarget.report.quantity).toLocaleString()}</p></div>}
        <FormField label={conditionReviewTarget?.status === 'UNDER_REVIEW' ? 'Review note' : 'Work or resolution notes'} required={conditionReviewTarget?.status === 'RESOLVED' || conditionReviewTarget?.status === 'WRITTEN_OFF'}><Textarea required={conditionReviewTarget?.status === 'RESOLVED' || conditionReviewTarget?.status === 'WRITTEN_OFF'} maxLength={1000} value={conditionReviewNote} onChange={event => setConditionReviewNote(event.target.value)} placeholder="Record inspection, repair, or resolution details" /></FormField>
        <div className="flex flex-col-reverse gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:justify-end"><Button type="button" variant="outline" disabled={conditionReviewSaving} onClick={() => setConditionReviewTarget(null)}>Cancel</Button><Button type="submit" isLoading={conditionReviewSaving} variant={conditionReviewTarget?.status === 'WRITTEN_OFF' ? 'destructive' : 'primary'}>Confirm update</Button></div>
      </form>
    </Dialog>
    <ConfirmationDialog open={!!deleteTarget} onOpenChange={open => { if (!open) setDeleteTarget(null); }} title="Remove inventory item?" description={`${deleteTarget?.name || 'This item'} will be removed from your active company inventory.`} confirmLabel="Remove" variant="destructive" onConfirm={remove} />
  </div>;
}
