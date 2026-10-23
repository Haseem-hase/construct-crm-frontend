import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { ApiContractor, ApiContractorStatus } from '../types/contractor.types';
import {
  updateContractor,
  selectUpdateContractorStatus,
  selectUpdateContractorError,
  resetUpdateState,
} from '../store/contractorsSlice';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { User } from '@/src/components/ui/icons';
import { PageHeader } from '@/src/components/ui/page-header';
import { ContractorStatusActions } from './contractor-status-actions';

interface ContractorDetailsHeaderProps {
  contractor: ApiContractor;
  onStatusSuccess?: (message: string) => void;
}

function getStatusVariant(status: ApiContractorStatus): 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'neutral' {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'SUSPENDED':
      return 'destructive';
    case 'INACTIVE':
      return 'neutral';
    case 'TERMINATED':
      return 'destructive';
    default:
      return 'default';
  }
}

export function ContractorDetailsHeader({ contractor, onStatusSuccess }: ContractorDetailsHeaderProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const updateStatus = useAppSelector(selectUpdateContractorStatus);
  const updateError = useAppSelector(selectUpdateContractorError);
  const isUpdating = updateStatus === 'loading';

  const handleStatusChange = async (newStatus: ApiContractorStatus) => {
    dispatch(resetUpdateState());
    const resultAction = await dispatch(
      updateContractor({
        id: contractor.id,
        payload: { status: newStatus },
      })
    );

    if (updateContractor.fulfilled.match(resultAction)) {
      const message = resultAction.payload.message || `Status updated to ${newStatus}`;
      onStatusSuccess?.(message);
    }
  };

  return (
    <>
      {updateStatus === 'failed' && updateError && (
        <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-sm">Failed to update status</h3>
              <p className="text-sm mt-1">{updateError}</p>
            </div>
            <button
              type="button"
              onClick={() => dispatch(resetUpdateState())}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <PageHeader
        title={contractor.fullName}
        subtitle={contractor.contractorCode}
        badges={
          <Badge variant={getStatusVariant(contractor.status)}>
            {contractor.status}
          </Badge>
        }
        backLink={{ href: '/contractors', label: 'Back to Contractors' }}
        avatar={
          <div className="w-[72px] h-[72px] md:w-[96px] md:h-[96px] shrink-0 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center overflow-hidden">
            {contractor.profileImageUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={contractor.profileImageUrl}
                alt={`${contractor.fullName} profile`}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 md:w-10 md:h-10 text-neutral-400" />
            )}
          </div>
        }
        action={
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              disabled={isUpdating}
              onClick={() => router.push(`/contractors/${contractor.id}/edit`)}
            >
              Edit Contractor
            </Button>
            <ContractorStatusActions
              status={contractor.status}
              isUpdating={isUpdating}
              onStatusChange={handleStatusChange}
            />
          </div>
        }
      />
    </>
  );
}

