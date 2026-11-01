export type ApiEnvelope<T> = { success: boolean; message: string; data: T };
export type InventoryAssetType = 'MATERIAL' | 'TOOL' | 'MACHINERY';
export interface InventoryAsset {
  id: string;
  type: InventoryAssetType;
  code: string;
  name: string;
  quantity: string | number;
  price: string | number;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface InventoryAssetPage {
  rows: InventoryAsset[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}
