import React from 'react';
import { useRouter } from 'next/navigation';
import { Labour } from '../types/labour.types';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { User } from '@/src/components/ui/icons';
import { ConfirmationDialog } from '@/src/components/ui/confirmation-dialog';
import { LabourStatusActions } from './labour-status-actions';
import { PageHeader } from '@/src/components/ui/page-header';

interface LabourDetailsHeaderProps {
  labour: Labour;
  onUpdate?: (updates: Partial<Labour>) => void;
}

export function LabourDetailsHeader({ labour, onUpdate }: LabourDetailsHeaderProps) {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, and WEBP are allowed.');
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    if (onUpdate) {
      onUpdate({ profileImageUrl: imageUrl });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = () => {
    if (onUpdate) {
      onUpdate({ profileImageUrl: undefined });
    }
    setIsRemoveDialogOpen(false);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'neutral';
      default: return 'default';
    }
  };

  return (
    <>
      <PageHeader
        title={labour.fullName}
        subtitle={labour.professionName}
        badges={
          <Badge variant={getStatusVariant(labour.status)}>
            {labour.status === 'ACTIVE' ? 'Active' : 'Inactive'}
          </Badge>
        }
        backLink={{ href: '/labour', label: 'Back to Labour' }}
        avatar={
          <div className="flex flex-col items-center gap-3">
            <div className="w-[72px] h-[72px] md:w-[96px] md:h-[96px] shrink-0 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center overflow-hidden">
              {labour.profileImageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img 
                  src={labour.profileImageUrl} 
                  alt={`${labour.fullName} profile`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 md:w-10 md:h-10 text-neutral-400" />
              )}
            </div>
            
            {onUpdate && (
              <div className="flex flex-col gap-1 items-center">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/jpeg, image/png, image/webp" 
                  onChange={handleFileChange} 
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs h-7 px-2"
                >
                  {labour.profileImageUrl ? 'Change Photo' : 'Add Photo'}
                </Button>
                {labour.profileImageUrl && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setIsRemoveDialogOpen(true)}
                  >
                    Remove Photo
                  </Button>
                )}
              </div>
            )}
          </div>
        }
        action={
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Button 
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => router.push(`/labour/${labour.id}/edit`)}
            >
              Edit Labour
            </Button>
            {onUpdate && (
              <LabourStatusActions 
                status={labour.status} 
                onStatusChange={(status) => onUpdate({ status })} 
              />
            )}
          </div>
        }
      />

      <ConfirmationDialog
        open={isRemoveDialogOpen}
        onOpenChange={(open) => setIsRemoveDialogOpen(open)}
        onConfirm={handleRemovePhoto}
        title="Remove profile photo?"
        description="Are you sure you want to remove this profile photo?"
        confirmLabel="Remove Photo"
        cancelLabel="Cancel"
        variant="destructive"
      />
    </>
  );
}
