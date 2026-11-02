const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export function inventoryImageUrl(value: string | null | undefined) {
  if (!value) return null;
  try {
    return new URL(value, `${new URL(API_BASE_URL).origin}/`).toString();
  } catch {
    return value;
  }
}
