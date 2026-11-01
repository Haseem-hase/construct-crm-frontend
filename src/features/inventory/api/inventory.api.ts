import { apiClient } from '@/src/lib/api/client';
import { ApiEnvelope, InventoryAsset, InventoryAssetPage, InventoryAssetType } from '../types/inventory.types';

export interface InventoryAssetInput {
  type: InventoryAssetType;
  code: string;
  name: string;
  quantity: string;
  price: string;
  description?: string | null;
  imageUrl?: string | null;
}

export const inventoryApi = {
  async assets(params: { page: number; pageSize: number; search?: string; type?: InventoryAssetType }) {
    return (await apiClient.get<ApiEnvelope<{ result: InventoryAssetPage }>>('/inventory/assets', { params })).data.data.result;
  },
  async createAsset(payload: InventoryAssetInput) {
    return (await apiClient.post<ApiEnvelope<{ asset: InventoryAsset }>>('/inventory/assets', payload)).data.data.asset;
  },
  async updateAsset(id: string, payload: InventoryAssetInput) {
    return (await apiClient.patch<ApiEnvelope<{ asset: InventoryAsset }>>(`/inventory/assets/${id}`, payload)).data.data.asset;
  },
  async deleteAsset(id: string) {
    return (await apiClient.delete<ApiEnvelope<{ asset: { id: string; isActive: boolean } }>>(`/inventory/assets/${id}`)).data.data.asset;
  },
};
