import { InventoryOrganizationGate } from '@/src/features/inventory/components/inventory-organization-gate';

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  return <InventoryOrganizationGate>{children}</InventoryOrganizationGate>;
}
