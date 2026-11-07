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

export interface InventoryWarehouse {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  type: 'CENTRAL' | 'PROJECT_SITE';
  projectId: string | null;
  address: string | null;
  isDefault: boolean;
  isActive: boolean;
  project?: { id: string; name: string; projectCode: string } | null;
  _count?: { stocks: number };
}

export interface WarehouseStock {
  id: string;
  organizationId: string;
  assetId: string;
  warehouseId: string;
  onHandQty: string | number;
  reservedQty: string | number;
  maintenanceQty: string | number;
  availableQty: string | number;
  asset: InventoryAsset;
  warehouse: InventoryWarehouse;
}

export type InventoryRequestStatus = 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'ISSUED' | 'PARTIALLY_RETURNED' | 'RETURNED' | 'CANCELLED';
export interface InventoryRequest {
  id: string;
  referenceNumber: string;
  status: InventoryRequestStatus;
  purpose: string | null;
  reviewNote: string | null;
  submittedAt: string;
  issuedAt: string | null;
  project: { id: string; name: string; projectCode: string };
  requestedForLabourAssignment: { id: string; labour: { id: string; fullName: string; phone: string }; assignment: { contractor: { id: string; fullName: string } } } | null;
  warehouse: { id: string; name: string; code: string };
  requestedBy: { id: string; fullName: string; email: string };
  reviewedBy: { id: string; fullName: string; email: string } | null;
  lines: Array<{
    id: string;
    requestedQty: string | number;
    approvedQty: string | number | null;
    issuedQty: string | number;
    returnedQty: string | number;
    asset: { id: string; code: string; name: string; type: InventoryAssetType; quantity: string | number; price: string | number };
  }>;
}

export interface InventoryReturnRequest {
  id: string;
  referenceNumber: string;
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'RECEIVED' | 'CANCELLED';
  reviewNote: string | null;
  submittedAt: string;
  request: { id: string; referenceNumber: string; project: { id: string; name: string; projectCode: string } };
  warehouse: { id: string; name: string; code: string };
  requestedBy: { id: string; fullName: string; email: string };
  reviewedBy: { id: string; fullName: string; email: string } | null;
  lines: Array<{
    id: string;
    quantity: string | number;
    condition: string | null;
    requestLine: { id: string; asset: { id: string; name: string; code: string; type: InventoryAssetType } };
  }>;
}

export interface InventoryConditionReport {
  id: string;
  quantity: string | number;
  description: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'IN_REPAIR' | 'RESOLVED' | 'WRITTEN_OFF';
  resolutionNote: string | null;
  createdAt: string;
  asset: { id: string; name: string; code: string; type: InventoryAssetType };
  warehouse: { id: string; name: string; code: string };
  request: { id: string; referenceNumber: string; project: { id: string; name: string; projectCode: string } } | null;
  requestLine: { id: string; issuedQty: string | number; returnedQty: string | number } | null;
  reportedBy: { id: string; fullName: string; email: string };
  reviewedBy: { id: string; fullName: string; email: string } | null;
}
