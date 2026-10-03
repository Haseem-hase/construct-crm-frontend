import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Contractor } from '../types/contractor.types';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { User } from '@/src/components/ui/icons';
import { ConfirmationDialog } from '@/src/components/ui/confirmation-dialog';
import { ContractorStatusActions } from './contractor-status-actions';
import { PageHeader } from '@/src/components/ui/page-header';

interface ContractorDetailsHeaderProps {
  contractor: Contractor;
  onUpdate?: (updates: Partial<Contractor>) => void;
}

export function ContractorDetailsHeader({ contractor, onUpdate }: ContractorDetailsHeaderProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, and WEBP are allowed.');
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    if (onUpdate) {
      onUpdate({ profileImage: imageUrl });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = () => {
    if (onUpdate) {
      onUpdate({ profileImage: undefined });
    }
    setIsRemoveDialogOpen(false);
  };

  return (
    <>
      <PageHeader
        title={contractor.companyName}
        subtitle={contractor.contractorCode}
        badges={
          <Badge variant={contractor.status === 'Active' ? 'success' : 'neutral'}>
            {contractor.status}
          </Badge>
        }
        backLink={{ href: '/contractors', label: 'Back to Contractors' }}
        avatar={
          <div className="flex flex-col items-center gap-3">
            <div className="w-[72px] h-[72px] md:w-[96px] md:h-[96px] shrink-0 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center overflow-hidden">
              {contractor.profileImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img 
                  src={contractor.profileImage} 
                  alt={`${contractor.companyName} profile`} 
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
                  {contractor.profileImage ? 'Change Photo' : 'Add Photo'}
                </Button>
                {contractor.profileImage && (
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
              onClick={() => router.push(`/contractors/${contractor.id}/edit`)}
            >
              Edit Contractor
            </Button>
            {onUpdate && (
              <ContractorStatusActions 
                status={contractor.status}
                onStatusChange={(newStatus) => onUpdate({ status: newStatus })}
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
        description="Are you sure you want to remove this contractor profile photo?"
        confirmLabel="Remove Photo"
        cancelLabel="Cancel"
        variant="destructive"
      />
    </>
  );
}
