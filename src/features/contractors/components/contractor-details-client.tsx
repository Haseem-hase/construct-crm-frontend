'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch } from '@/src/store/hooks';
import { ApiContractor, UpdateContractorRequest } from '../types/contractor.types';
import { updateContractor } from '../store/contractorsSlice';
import { ContractorDetailsHeader } from './contractor-details-header';
import { ContractorOverview } from './contractor-overview';
import { ContractorContactInfo } from './contractor-contact-info';
import { ContractorLocation } from './contractor-location';
import { ContractorLicense } from './contractor-license';
import { SuccessAlert } from '@/src/components/ui/success-alert';

export function ContractorDetailsClient({ contractor }: { contractor: ApiContractor }) {
  const dispatch = useAppDispatch();
  const [successAlert, setSuccessAlert] = useState<{
    show: boolean;
    title: string;
    description: string;
  }>({
    show: false,
    title: 'Saved Successfully',
    description: '',
  });
  const [bannerError, setBannerError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerSuccess = (title: string, description: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setSuccessAlert({
      show: true,
      title,
      description,
    });
    timeoutRef.current = setTimeout(() => {
      setSuccessAlert((prev) => ({ ...prev, show: false }));
    }, 3500);
  };

  // Keep track of the active contractor ID to prevent race conditions from stale requests
  const activeContractorIdRef = useRef(contractor.id);
  useEffect(() => {
    activeContractorIdRef.current = contractor.id;
  }, [contractor.id]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleUpdate = async (field: keyof ApiContractor, rawValue: string): Promise<boolean> => {
    const targetId = contractor.id;
    const value = rawValue.trim();

    // Check if value actually changed
    const currentValue = contractor[field];
    if (field === 'licenseExpiryDate') {
      const currentExpiryDate = currentValue ? (currentValue as string).split('T')[0] : '';
      if (value === currentExpiryDate) {
        return true;
      }
    } else {
      const currentStr = currentValue == null ? '' : String(currentValue).trim();
      if (value === currentStr) {
        return true;
      }
    }

    // Validation
    const payload: UpdateContractorRequest = {};

    switch (field) {
      case 'fullName': {
        if (!value) {
          throw new Error('Full name is required.');
        }
        if (value.length < 2) {
          throw new Error('Full name must be at least 2 characters.');
        }
        if (value.length > 150) {
          throw new Error('Full name must not exceed 150 characters.');
        }
        payload.fullName = value;
        break;
      }

      case 'phone': {
        if (!value) {
          throw new Error('Phone number is required.');
        }
        if (value.length < 5) {
          throw new Error('Phone number is too short.');
        }
        if (value.length > 50) {
          throw new Error('Phone number must not exceed 50 characters.');
        }
        payload.phone = value;
        break;
      }

      case 'country': {
        if (!value) {
          throw new Error('Country is required.');
        }
        if (value.length < 2) {
          throw new Error('Country must be at least 2 characters.');
        }
        if (value.length > 100) {
          throw new Error('Country must not exceed 100 characters.');
        }
        payload.country = value;
        break;
      }

      case 'city': {
        if (!value) {
          throw new Error('City is required.');
        }
        if (value.length > 100) {
          throw new Error('City must not exceed 100 characters.');
        }
        payload.city = value;
        break;
      }

      case 'email': {
        if (value) {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            throw new Error('Enter a valid email address.');
          }
          payload.email = value;
        } else {
          // Clearing optional email
          payload.email = '';
        }
        break;
      }

      case 'alternativePhone': {
        if (value && value.length > 50) {
          throw new Error('Alternative phone must not exceed 50 characters.');
        }
        payload.alternativePhone = value;
        break;
      }

      case 'address': {
        if (value && value.length > 255) {
          throw new Error('Address must not exceed 255 characters.');
        }
        payload.address = value;
        break;
      }

      case 'nationalId': {
        if (value && value.length > 100) {
          throw new Error('National ID must not exceed 100 characters.');
        }
        payload.nationalId = value;
        break;
      }

      case 'licenseNumber': {
        if (value && value.length > 100) {
          throw new Error('License number must not exceed 100 characters.');
        }
        payload.licenseNumber = value;
        break;
      }

      case 'licenseExpiryDate': {
        if (value) {
          const dateObj = new Date(value);
          if (isNaN(dateObj.getTime())) {
            throw new Error('Invalid date.');
          }
          payload.licenseExpiryDate = dateObj.toISOString();
        } else {
          payload.licenseExpiryDate = null;
        }
        break;
      }

      case 'notes': {
        payload.notes = value;
        break;
      }

      default:
        return false;
    }

    setBannerError(null);

    const resultAction = await dispatch(
      updateContractor({
        id: targetId,
        payload,
      })
    );

    // Stale check
    if (activeContractorIdRef.current !== targetId) {
      return false;
    }

    if (updateContractor.fulfilled.match(resultAction)) {
      const message = resultAction.payload.message || 'Contractor updated successfully.';
      triggerSuccess('Saved Successfully', message);
      return true;
    } else {
      const errorMessage =
        (resultAction.payload as string) ||
        resultAction.error?.message ||
        'Failed to update contractor';
      setBannerError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <SuccessAlert
        show={successAlert.show}
        title={successAlert.title}
        description={successAlert.description}
      />

      {bannerError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-sm">Failed to update contractor</h3>
              <p className="text-sm mt-1">{bannerError}</p>
            </div>
            <button
              type="button"
              onClick={() => setBannerError(null)}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <ContractorDetailsHeader
        contractor={contractor}
        onStatusSuccess={(message) => {
          setBannerError(null);
          triggerSuccess('Status Updated', message);
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ContractorOverview contractor={contractor} onUpdate={handleUpdate} />
        <ContractorContactInfo contractor={contractor} onUpdate={handleUpdate} />
        <ContractorLocation contractor={contractor} onUpdate={handleUpdate} />
        <ContractorLicense contractor={contractor} onUpdate={handleUpdate} />
      </div>
    </div>
  );
}
