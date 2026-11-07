import { apiClient } from '@/src/lib/api/client';
import { ApiEnvelope, InventoryAsset, InventoryAssetPage, InventoryAssetType, InventoryConditionReport, InventoryRequest, InventoryReturnRequest, InventoryWarehouse, WarehouseStock } from '../types/inventory.types';

export interface InventoryAssetInput {
  type: InventoryAssetType;
  code: string;
  name: string;
  quantity: string;
  price: string;
  description?: string | null;
  image?: File | null;
}

export interface InventoryWarehouseInput {
  code: string;
  name: string;
  type: 'CENTRAL' | 'PROJECT_SITE';
  projectId?: string;
  address?: string | null;
}

interface InventoryStockAdjustmentResult {
  id: string;
  organizationId: string;
  assetId: string;
  warehouseId: string;
  onHandQty: string | number;
  reservedQty: string | number;
  maintenanceQty: string | number;
  availableQty: string | number;
  reason: string;
}

const assetPayload = (payload: InventoryAssetInput) => {
  if (!payload.image) {
    const jsonPayload = { ...payload };
    delete jsonPayload.image;
    return jsonPayload;
  }
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (key === 'image' && value instanceof File) formData.append('image', value);
    else if (value !== undefined && value !== null) formData.append(key, String(value));
  });
  return formData;
};

export const inventoryApi = {
  async asset(id: string) {
    return (await apiClient.get<ApiEnvelope<{ asset: InventoryAsset }>>(`/inventory/assets/${id}`)).data.data.asset;
  },
  async assets(params: { page: number; pageSize: number; search?: string; type?: InventoryAssetType }) {
    return (await apiClient.get<ApiEnvelope<{ result: InventoryAssetPage }>>('/inventory/assets', { params })).data.data.result;
  },
  async createAsset(payload: InventoryAssetInput) {
    return (await apiClient.post<ApiEnvelope<{ asset: InventoryAsset }>>('/inventory/assets', assetPayload(payload))).data.data.asset;
  },
  async updateAsset(id: string, payload: InventoryAssetInput) {
    return (await apiClient.patch<ApiEnvelope<{ asset: InventoryAsset }>>(`/inventory/assets/${id}`, assetPayload(payload))).data.data.asset;
  },
  async deleteAsset(id: string) {
    return (await apiClient.delete<ApiEnvelope<{ asset: { id: string; isActive: boolean } }>>(`/inventory/assets/${id}`)).data.data.asset;
  },
  async warehouses() {
    return (await apiClient.get<ApiEnvelope<{ warehouses: InventoryWarehouse[] }>>('/inventory/warehouses')).data.data.warehouses;
  },
  async createWarehouse(payload: InventoryWarehouseInput) {
    return (await apiClient.post<ApiEnvelope<{ warehouse: InventoryWarehouse }>>('/inventory/warehouses', payload)).data.data.warehouse;
  },
  async warehouseStock(params: { warehouseId?: string; search?: string } = {}) {
    return (await apiClient.get<ApiEnvelope<{ stock: WarehouseStock[] }>>('/inventory/stock', { params })).data.data.stock;
  },
  async adjustStock(payload: { assetId: string; warehouseId: string; quantityDelta: string; reason: string }) {
    return (await apiClient.post<ApiEnvelope<{ movement: InventoryStockAdjustmentResult }>>('/inventory/stock/adjustments', payload)).data.data.movement;
  },
  async requests(params: { status?: InventoryRequest['status'] } = {}) {
    return (await apiClient.get<ApiEnvelope<{ requests: InventoryRequest[] }>>('/inventory/requests', { params })).data.data.requests;
  },
  async createRequest(payload: { warehouseId: string; projectId: string; labourAssignmentId?: string; purpose?: string; lines: Array<{ assetId: string; quantity: string }> }) {
    return (await apiClient.post<ApiEnvelope<{ request: InventoryRequest }>>('/inventory/requests', payload)).data.data.request;
  },
  async reviewRequest(id: string, payload: { decision: 'APPROVE' | 'REJECT'; note?: string }) {
    return (await apiClient.post<ApiEnvelope<{ request: InventoryRequest }>>(`/inventory/requests/${id}/review`, payload)).data.data.request;
  },
  async issueRequest(id: string) {
    return (await apiClient.post<ApiEnvelope<{ request: InventoryRequest }>>(`/inventory/requests/${id}/issue`)).data.data.request;
  },
  async returns() {
    return (await apiClient.get<ApiEnvelope<{ returns: InventoryReturnRequest[] }>>('/inventory/returns')).data.data.returns;
  },
  async createReturn(payload: { requestId: string; lines: Array<{ requestLineId: string; quantity: string; condition: 'GOOD' | 'DAMAGED' | 'REPAIR_REQUIRED' }> }) {
    return (await apiClient.post<ApiEnvelope<{ return: InventoryReturnRequest }>>('/inventory/returns', payload)).data.data.return;
  },
  async reviewReturn(id: string, payload: { decision: 'APPROVE' | 'REJECT'; note?: string }) {
    return (await apiClient.post<ApiEnvelope<{ return: InventoryReturnRequest }>>(`/inventory/returns/${id}/review`, payload)).data.data.return;
  },
  async conditionReports() {
    return (await apiClient.get<ApiEnvelope<{ reports: InventoryConditionReport[] }>>('/inventory/condition-reports')).data.data.reports;
  },
  async createConditionReport(payload: { requestLineId: string; quantity: string; description: string }) {
    return (await apiClient.post<ApiEnvelope<{ report: InventoryConditionReport }>>('/inventory/condition-reports', payload)).data.data.report;
  },
  async updateConditionReport(id: string, payload: { status: InventoryConditionReport['status']; resolutionNote?: string }) {
    return (await apiClient.patch<ApiEnvelope<{ report: InventoryConditionReport }>>(`/inventory/condition-reports/${id}`, payload)).data.data.report;
  },
};
