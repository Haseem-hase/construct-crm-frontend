'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Dialog } from '@/src/components/ui/dialog';
import { ConfirmationDialog } from '@/src/components/ui/confirmation-dialog';
import { FormField } from '@/src/components/ui/form-field';
import { Input } from '@/src/components/ui/input';
import { SuccessAlert } from '@/src/components/ui/success-alert';
import { Customer, CustomerContact, CreateCustomerContactRequest, UpdateCustomerContactRequest } from '../types/customer.types';
import {
  fetchCustomerContacts,
  createCustomerContact,
  updateCustomerContact,
  deleteCustomerContact,
  selectCustomerContacts,
  selectCustomerContactsStatus,
  selectCustomerContactsError,
  selectCreateContactStatus,
  selectCreateContactError,
  selectUpdateContactStatus,
  selectUpdateContactError,
  selectDeleteContactStatus,
  selectDeleteContactError,
  resetContactMutationStates,
} from '../store/customersSlice';

interface CustomerContactInformationProps {
  customer: Customer;
  onUpdate?: (field: keyof Customer, value: string) => Promise<boolean | void> | boolean | void;
}

export function CustomerContactInformation({ customer }: CustomerContactInformationProps) {
  const dispatch = useAppDispatch();
  const contacts = useAppSelector(selectCustomerContacts);
  const status = useAppSelector(selectCustomerContactsStatus);
  const error = useAppSelector(selectCustomerContactsError);
  
  const createStatus = useAppSelector(selectCreateContactStatus);
  const createError = useAppSelector(selectCreateContactError);
  
  const updateStatus = useAppSelector(selectUpdateContactStatus);
  const updateError = useAppSelector(selectUpdateContactError);

  const deleteStatus = useAppSelector(selectDeleteContactStatus);
  const deleteError = useAppSelector(selectDeleteContactError);

  // Add Contact Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    email: '',
    phone: '',
    otherPhone: '',
    isPrimary: false,
  });
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // Edit Contact Modal State
  const [editingContact, setEditingContact] = useState<CustomerContact | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    designation: '',
    email: '',
    phone: '',
    otherPhone: '',
  });
  const [editValidationErrors, setEditValidationErrors] = useState<{ [key: string]: string }>({});

  // Delete Contact State
  const [contactToDelete, setContactToDelete] = useState<CustomerContact | null>(null);

  // Notification State
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successTitle, setSuccessTitle] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const alertTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, []);

  const triggerSuccessAlert = (title: string, message: string) => {
    setSuccessTitle(title);
    setSuccessMessage(message);
    setShowSuccessAlert(true);
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    alertTimeoutRef.current = setTimeout(() => {
      setShowSuccessAlert(false);
    }, 3000);
  };

  useEffect(() => {
    setShowSuccessAlert(false);
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    if (customer?.id) {
      dispatch(fetchCustomerContacts(customer.id));
    }
  }, [customer?.id, dispatch]);

  // Add Contact Handlers
  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      designation: '',
      email: '',
      phone: '',
      otherPhone: '',
      isPrimary: contacts.length === 0, // Auto-select primary if first contact
    });
    setValidationErrors({});
    dispatch(resetContactMutationStates());
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setValidationErrors({});
    dispatch(resetContactMutationStates());
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateContactFields = (data: {
    name: string;
    designation: string;
    email: string;
    phone: string;
    otherPhone: string;
  }) => {
    const errors: { [key: string]: string } = {};
    const trimmedName = data.name.trim();
    const trimmedDesignation = data.designation.trim();
    const trimmedEmail = data.email.trim();
    const trimmedPhone = data.phone.trim();
    const trimmedOtherPhone = data.otherPhone.trim();

    if (!trimmedName) {
      errors.name = 'Contact name is required.';
    } else if (trimmedName.length < 2) {
      errors.name = 'Contact name must be at least 2 characters.';
    } else if (trimmedName.length > 150) {
      errors.name = 'Contact name must not exceed 150 characters.';
    }

    if (!trimmedDesignation) {
      errors.designation = 'Designation is required.';
    } else if (trimmedDesignation.length < 2) {
      errors.designation = 'Designation must be at least 2 characters.';
    } else if (trimmedDesignation.length > 100) {
      errors.designation = 'Designation must not exceed 100 characters.';
    }

    if (!trimmedEmail) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Invalid email address.';
    } else if (trimmedEmail.length > 255) {
      errors.email = 'Email must not exceed 255 characters.';
    }

    if (!trimmedPhone) {
      errors.phone = 'Phone number is required.';
    } else if (trimmedPhone.length > 30) {
      errors.phone = 'Phone number must not exceed 30 characters.';
    }

    if (trimmedOtherPhone && trimmedOtherPhone.length > 30) {
      errors.otherPhone = 'Other phone number must not exceed 30 characters.';
    }

    return {
      errors,
      values: {
        name: trimmedName,
        designation: trimmedDesignation,
        email: trimmedEmail,
        phone: trimmedPhone,
        otherPhone: trimmedOtherPhone,
      },
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (createStatus === 'loading') return;

    const { errors, values } = validateContactFields(formData);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const payload: CreateCustomerContactRequest = {
      name: values.name,
      designation: values.designation,
      email: values.email,
      phone: values.phone,
      ...(values.otherPhone ? { otherPhone: values.otherPhone } : {}),
      isPrimary: formData.isPrimary,
    };

    const action = await dispatch(
      createCustomerContact({
        customerId: customer.id,
        payload,
      })
    );

    if (createCustomerContact.fulfilled.match(action)) {
      handleCloseAddModal();
      triggerSuccessAlert(
        'Contact Created',
        action.payload?.message || 'Contact created successfully.'
      );
    }
  };

  // Edit Contact Handlers
  const handleOpenEditModal = (contact: CustomerContact) => {
    setEditingContact(contact);
    setEditFormData({
      name: contact.name || '',
      designation: contact.designation || '',
      email: contact.email || '',
      phone: contact.phone || '',
      otherPhone: contact.otherPhone || '',
    });
    setEditValidationErrors({});
    dispatch(resetContactMutationStates());
  };

  const handleCloseEditModal = () => {
    setEditingContact(null);
    setEditValidationErrors({});
    dispatch(resetContactMutationStates());
  };

  const handleEditInputChange = (field: string, value: string) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
    if (editValidationErrors[field]) {
      setEditValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContact || updateStatus === 'loading') return;

    const { errors, values } = validateContactFields(editFormData);

    if (Object.keys(errors).length > 0) {
      setEditValidationErrors(errors);
      return;
    }

    const payload: UpdateCustomerContactRequest = {
      name: values.name,
      designation: values.designation,
      email: values.email,
      phone: values.phone,
      otherPhone: values.otherPhone || undefined,
    };

    const action = await dispatch(
      updateCustomerContact({
        customerId: customer.id,
        contactId: editingContact.id,
        payload,
      })
    );

    if (updateCustomerContact.fulfilled.match(action)) {
      handleCloseEditModal();
      triggerSuccessAlert(
        'Contact Updated',
        action.payload?.message || 'Contact updated successfully.'
      );
    }
  };

  // Delete Contact Handlers
  const handleOpenDeleteDialog = (contact: CustomerContact) => {
    setContactToDelete(contact);
    dispatch(resetContactMutationStates());
  };

  const handleCloseDeleteDialog = (open: boolean) => {
    if (!open) {
      if (deleteStatus !== 'loading') {
        setContactToDelete(null);
        dispatch(resetContactMutationStates());
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!contactToDelete || deleteStatus === 'loading') return;

    const action = await dispatch(
      deleteCustomerContact({
        customerId: customer.id,
        contactId: contactToDelete.id,
      })
    );

    if (deleteCustomerContact.fulfilled.match(action)) {
      const msg = action.payload?.message || 'Contact deleted successfully.';
      setContactToDelete(null);
      dispatch(resetContactMutationStates());
      triggerSuccessAlert('Contact Deleted', msg);
    } else {
      const errorMsg =
        (action.payload as string) ||
        action.error?.message ||
        'Failed to delete contact.';
      throw new Error(errorMsg);
    }
  };

  return (
    <>
      <SuccessAlert
        show={showSuccessAlert}
        title={successTitle}
        description={successMessage}
      />
      <Card className="w-full min-w-0 h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Contact Information</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpenAddModal}
            className="text-xs h-8"
          >
            + Add Contact
          </Button>
        </CardHeader>
        <CardContent>
          {status === 'loading' && contacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-neutral-500">
              <svg
                className="w-6 h-6 animate-spin mb-2 text-neutral-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-xs">Loading contacts...</p>
            </div>
          ) : status === 'failed' && contacts.length === 0 ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex justify-between items-center">
              <span>{error || 'Failed to load contacts.'}</span>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 ml-2"
                onClick={() => dispatch(fetchCustomerContacts(customer.id))}
              >
                Retry
              </Button>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8 px-4 border border-dashed border-neutral-200 rounded-lg">
              <p className="text-sm font-medium text-neutral-700 mb-1">No contacts added yet</p>
              <p className="text-xs text-neutral-500 mb-4">
                Add contact persons associated with this customer.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleOpenAddModal}
                className="text-xs"
              >
                Add First Contact
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-4 rounded-lg border border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900 leading-tight">
                        {contact.name}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-0.5">{contact.designation}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {contact.isPrimary && (
                        <Badge variant="success" className="text-[10px] px-2 py-0.5">
                          Primary
                        </Badge>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEditModal(contact)}
                        className="text-[11px] h-6 px-2 text-neutral-600 hover:text-neutral-900 border-neutral-200 hover:bg-neutral-100"
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDeleteDialog(contact)}
                        className="text-[11px] h-6 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-neutral-200"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-1 text-xs text-neutral-600 mt-3 pt-3 border-t border-neutral-100">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400 w-12 font-medium">Email:</span>
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-blue-600 hover:underline truncate"
                      >
                        {contact.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400 w-12 font-medium">Phone:</span>
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-neutral-800 hover:text-neutral-900"
                      >
                        {contact.phone}
                      </a>
                    </div>
                    {contact.otherPhone && (
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-400 w-12 font-medium">Other:</span>
                        <a
                          href={`tel:${contact.otherPhone}`}
                          className="text-neutral-800 hover:text-neutral-900"
                        >
                          {contact.otherPhone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Contact Modal */}
      <Dialog
        open={isAddModalOpen}
        onOpenChange={(open) => !open && handleCloseAddModal()}
        title="Add Customer Contact"
        description="Add a new contact person associated with this customer."
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {createStatus === 'failed' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
              {createError || 'Failed to create contact.'}
            </div>
          )}

          <FormField label="Contact Person Name" required error={validationErrors.name}>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g. John Doe"
              error={!!validationErrors.name}
              disabled={createStatus === 'loading'}
            />
          </FormField>

          <FormField label="Designation" required error={validationErrors.designation}>
            <Input
              value={formData.designation}
              onChange={(e) => handleInputChange('designation', e.target.value)}
              placeholder="e.g. Procurement Manager"
              error={!!validationErrors.designation}
              disabled={createStatus === 'loading'}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Email Address" required error={validationErrors.email}>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john@example.com"
                error={!!validationErrors.email}
                disabled={createStatus === 'loading'}
              />
            </FormField>

            <FormField label="Phone Number" required error={validationErrors.phone}>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+966 50 123 4567"
                error={!!validationErrors.phone}
                disabled={createStatus === 'loading'}
              />
            </FormField>
          </div>

          <FormField label="Other Phone (Optional)" error={validationErrors.otherPhone}>
            <Input
              type="tel"
              value={formData.otherPhone}
              onChange={(e) => handleInputChange('otherPhone', e.target.value)}
              placeholder="+966 50 765 4321"
              error={!!validationErrors.otherPhone}
              disabled={createStatus === 'loading'}
            />
          </FormField>

          <div className="flex items-center gap-2 pt-1">
            <input
              id="isPrimaryContact"
              type="checkbox"
              checked={formData.isPrimary}
              onChange={(e) => handleInputChange('isPrimary', e.target.checked)}
              disabled={createStatus === 'loading'}
              className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
            />
            <label
              htmlFor="isPrimaryContact"
              className="text-sm font-medium text-neutral-700 cursor-pointer select-none"
            >
              Set as primary contact
            </label>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-neutral-100">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseAddModal}
              disabled={createStatus === 'loading'}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={createStatus === 'loading'}
            >
              {createStatus === 'loading' ? 'Saving...' : 'Add Contact'}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Edit Contact Modal */}
      <Dialog
        open={!!editingContact}
        onOpenChange={(open) => !open && handleCloseEditModal()}
        title="Edit Customer Contact"
        description="Update the contact person's details."
      >
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 mt-2">
          {updateStatus === 'failed' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
              {updateError || 'Failed to update contact.'}
            </div>
          )}

          <FormField label="Contact Person Name" required error={editValidationErrors.name}>
            <Input
              value={editFormData.name}
              onChange={(e) => handleEditInputChange('name', e.target.value)}
              placeholder="e.g. John Doe"
              error={!!editValidationErrors.name}
              disabled={updateStatus === 'loading'}
            />
          </FormField>

          <FormField label="Designation" required error={editValidationErrors.designation}>
            <Input
              value={editFormData.designation}
              onChange={(e) => handleEditInputChange('designation', e.target.value)}
              placeholder="e.g. Procurement Manager"
              error={!!editValidationErrors.designation}
              disabled={updateStatus === 'loading'}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Email Address" required error={editValidationErrors.email}>
              <Input
                type="email"
                value={editFormData.email}
                onChange={(e) => handleEditInputChange('email', e.target.value)}
                placeholder="john@example.com"
                error={!!editValidationErrors.email}
                disabled={updateStatus === 'loading'}
              />
            </FormField>

            <FormField label="Phone Number" required error={editValidationErrors.phone}>
              <Input
                type="tel"
                value={editFormData.phone}
                onChange={(e) => handleEditInputChange('phone', e.target.value)}
                placeholder="+966 50 123 4567"
                error={!!editValidationErrors.phone}
                disabled={updateStatus === 'loading'}
              />
            </FormField>
          </div>

          <FormField label="Other Phone (Optional)" error={editValidationErrors.otherPhone}>
            <Input
              type="tel"
              value={editFormData.otherPhone}
              onChange={(e) => handleEditInputChange('otherPhone', e.target.value)}
              placeholder="+966 50 765 4321"
              error={!!editValidationErrors.otherPhone}
              disabled={updateStatus === 'loading'}
            />
          </FormField>

          {editingContact?.isPrimary && (
            <div className="flex items-center gap-2 pt-1 text-xs text-neutral-500">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
              <span>This is currently the primary contact.</span>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-neutral-100">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseEditModal}
              disabled={updateStatus === 'loading'}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={updateStatus === 'loading'}
            >
              {updateStatus === 'loading' ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Contact Confirmation Dialog */}
      <ConfirmationDialog
        open={!!contactToDelete}
        onOpenChange={handleCloseDeleteDialog}
        title="Delete customer contact?"
        description={
          deleteStatus === 'failed' ? (
            <div className="flex flex-col gap-2">
              <span className="text-red-600 font-medium">
                {deleteError || 'Failed to delete contact.'}
              </span>
              <span className="text-neutral-500 text-xs">You may retry or cancel.</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2 text-sm text-neutral-600">
              <span>
                Are you sure you want to delete contact{' '}
                <strong className="text-neutral-900 font-semibold">"{contactToDelete?.name}"</strong>{' '}
                ({contactToDelete?.designation})? This will permanently remove this contact from this customer.
              </span>
              {contactToDelete?.isPrimary && (
                <span className="text-amber-700 bg-amber-50 p-2 rounded border border-amber-200 text-xs font-medium">
                  Notice: This is currently marked as the primary contact for this customer.
                </span>
              )}
            </div>
          )
        }
        confirmLabel={deleteStatus === 'loading' ? 'Deleting...' : 'Delete Contact'}
        variant="destructive"
        onConfirm={handleConfirmDelete}
        confirmDisabled={deleteStatus === 'loading'}
      />
    </>
  );
}
