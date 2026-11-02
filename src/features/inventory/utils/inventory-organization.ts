const ORGANIZATION_ID_KEY = 'constructcrm:inventory-organization-id';
const ORGANIZATION_NAME_KEY = 'constructcrm:inventory-organization-name';

export function getSelectedInventoryOrganization() {
  if (typeof window === 'undefined') return null;
  const id = window.localStorage.getItem(ORGANIZATION_ID_KEY);
  const name = window.localStorage.getItem(ORGANIZATION_NAME_KEY);
  return id ? { id, name: name || 'Selected organization' } : null;
}

export function setSelectedInventoryOrganization(organization: { id: string; name: string }) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ORGANIZATION_ID_KEY, organization.id);
  window.localStorage.setItem(ORGANIZATION_NAME_KEY, organization.name);
  window.dispatchEvent(new Event('constructcrm:inventory-organization-changed'));
}

export function clearSelectedInventoryOrganization() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ORGANIZATION_ID_KEY);
  window.localStorage.removeItem(ORGANIZATION_NAME_KEY);
  window.dispatchEvent(new Event('constructcrm:inventory-organization-changed'));
}
