import { Button } from '@/src/components/ui/button';

export function InventoryError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return <div role="alert" className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between"><span>{message}</span>{onRetry && <Button size="sm" variant="outline" onClick={onRetry}>Try again</Button>}</div>;
}

export function InventoryLoading({ label = 'Loading inventory…' }: { label?: string }) {
  return <div className="flex min-h-44 items-center justify-center rounded-xl border border-neutral-200 bg-white text-sm text-neutral-500"><span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />{label}</div>;
}
