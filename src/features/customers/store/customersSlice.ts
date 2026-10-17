import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerContact,
  CreateCustomerContactRequest,
  UpdateCustomerContactRequest,
} from '../types/customer.types';
import { customersApi } from '../api/customers.api';
import { customerContactsApi } from '../api/customer-contacts.api';

export interface CustomersState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  childCustomers: Customer[];
  contacts: CustomerContact[];
  selectedContact: CustomerContact | null;
  currentDetailId: string | null;
  currentChildrenId: string | null;
  currentContactsCustomerId: string | null;
  listStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  detailStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  childrenStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  contactsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  contactDetailStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  createContactStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateContactStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  deleteContactStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  deleteStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  listError: string | null;
  detailError: string | null;
  childrenError: string | null;
  contactsError: string | null;
  contactDetailError: string | null;
  createContactError: string | null;
  updateContactError: string | null;
  deleteContactError: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
}

const initialState: CustomersState = {
  customers: [],
  selectedCustomer: null,
  childCustomers: [],
  contacts: [],
  selectedContact: null,
  currentDetailId: null,
  currentChildrenId: null,
  currentContactsCustomerId: null,
  listStatus: 'idle',
  detailStatus: 'idle',
  childrenStatus: 'idle',
  contactsStatus: 'idle',
  contactDetailStatus: 'idle',
  createContactStatus: 'idle',
  updateContactStatus: 'idle',
  deleteContactStatus: 'idle',
  createStatus: 'idle',
  updateStatus: 'idle',
  deleteStatus: 'idle',
  listError: null,
  detailError: null,
  childrenError: null,
  contactsError: null,
  contactDetailError: null,
  createContactError: null,
  updateContactError: null,
  deleteContactError: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await customersApi.getCustomers();
      return response.data.customers;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to load customers');
    }
  }
);

export const fetchCustomerById = createAsyncThunk(
  'customers/fetchCustomerById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await customersApi.getCustomer(id);
      return response.data.customer;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to load customer details');
    }
  }
);

export const fetchCustomerChildren = createAsyncThunk(
  'customers/fetchCustomerChildren',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await customersApi.getCustomerChildren(id);
      return response.data.customers;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to load customer children');
    }
  }
);

export const createCustomer = createAsyncThunk(
  'customers/createCustomer',
  async (payload: CreateCustomerRequest, { rejectWithValue, dispatch }) => {
    try {
      const response = await customersApi.createCustomer(payload);
      dispatch(fetchCustomers());
      return { customer: response.data.customer, message: response.message };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to create customer');
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async ({ id, payload }: { id: string; payload: UpdateCustomerRequest }, { rejectWithValue, dispatch }) => {
    try {
      const response = await customersApi.updateCustomer(id, payload);
      dispatch(fetchCustomers());
      return { customer: response.data.customer, message: response.message };
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message ||
        'Failed to update customer';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await customersApi.deleteCustomer(id);
      return { id, ...response };
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message ||
        'Failed to delete customer';
      return rejectWithValue(errorMessage);
    }
  }
);

// Customer Contact Thunks
export const fetchCustomerContacts = createAsyncThunk(
  'customers/fetchCustomerContacts',
  async (customerId: string, { rejectWithValue }) => {
    try {
      const response = await customerContactsApi.getCustomerContacts(customerId);
      return { customerId, contacts: response.data.contacts };
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message ||
        'Failed to load customer contacts';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchCustomerContactById = createAsyncThunk(
  'customers/fetchCustomerContactById',
  async (
    { customerId, contactId }: { customerId: string; contactId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await customerContactsApi.getCustomerContact(customerId, contactId);
      return { customerId, contact: response.data.contact };
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message ||
        'Failed to load contact details';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createCustomerContact = createAsyncThunk(
  'customers/createCustomerContact',
  async (
    { customerId, payload }: { customerId: string; payload: CreateCustomerContactRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await customerContactsApi.createCustomerContact(customerId, payload);
      return { customerId, contact: response.data.contact, message: response.message };
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message ||
        'Failed to create contact';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateCustomerContact = createAsyncThunk(
  'customers/updateCustomerContact',
  async (
    {
      customerId,
      contactId,
      payload,
    }: {
      customerId: string;
      contactId: string;
      payload: UpdateCustomerContactRequest;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await customerContactsApi.updateCustomerContact(
        customerId,
        contactId,
        payload
      );
      return { customerId, contact: response.data.contact, message: response.message };
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message ||
        'Failed to update contact';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteCustomerContact = createAsyncThunk(
  'customers/deleteCustomerContact',
  async (
    { customerId, contactId }: { customerId: string; contactId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await customerContactsApi.deleteCustomerContact(customerId, contactId);
      return { customerId, contactId, message: response.data?.message || response.message };
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message ||
        'Failed to delete contact';
      return rejectWithValue(errorMessage);
    }
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
      state.currentDetailId = null;
      state.detailStatus = 'idle';
      state.detailError = null;
    },
    clearChildCustomers: (state) => {
      state.childCustomers = [];
      state.currentChildrenId = null;
      state.childrenStatus = 'idle';
      state.childrenError = null;
    },
    resetCreateState: (state) => {
      state.createStatus = 'idle';
      state.createError = null;
    },
    resetUpdateState: (state) => {
      state.updateStatus = 'idle';
      state.updateError = null;
    },
    resetDeleteState: (state) => {
      state.deleteStatus = 'idle';
      state.deleteError = null;
    },
    clearContacts: (state) => {
      state.contacts = [];
      state.selectedContact = null;
      state.currentContactsCustomerId = null;
      state.contactsStatus = 'idle';
      state.contactsError = null;
      state.contactDetailStatus = 'idle';
      state.contactDetailError = null;
    },
    resetContactMutationStates: (state) => {
      state.createContactStatus = 'idle';
      state.createContactError = null;
      state.updateContactStatus = 'idle';
      state.updateContactError = null;
      state.deleteContactStatus = 'idle';
      state.deleteContactError = null;
    },
  },
  extraReducers: (builder) => {
    // List Reducers
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.listStatus = 'loading';
        state.listError = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.listError = (action.payload as string) || action.error.message || 'Failed to fetch customers';
      });

    // Detail Reducers
    builder
      .addCase(fetchCustomerById.pending, (state, action) => {
        state.currentDetailId = action.meta.arg;
        state.detailStatus = 'loading';
        state.detailError = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        if (state.currentDetailId === action.meta.arg) {
          state.detailStatus = 'succeeded';
          state.selectedCustomer = action.payload;
        }
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        if (state.currentDetailId === action.meta.arg) {
          state.detailStatus = 'failed';
          state.detailError = (action.payload as string) || action.error.message || 'Failed to fetch customer details';
        }
      });

    // Children Reducers
    builder
      .addCase(fetchCustomerChildren.pending, (state, action) => {
        state.currentChildrenId = action.meta.arg;
        state.childrenStatus = 'loading';
        state.childrenError = null;
      })
      .addCase(fetchCustomerChildren.fulfilled, (state, action) => {
        if (state.currentChildrenId === action.meta.arg) {
          state.childrenStatus = 'succeeded';
          state.childCustomers = action.payload;
        }
      })
      .addCase(fetchCustomerChildren.rejected, (state, action) => {
        if (state.currentChildrenId === action.meta.arg) {
          state.childrenStatus = 'failed';
          state.childrenError = (action.payload as string) || action.error.message || 'Failed to fetch customer children';
        }
      });

    // Create Reducers
    builder
      .addCase(createCustomer.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = null;
      })
      .addCase(createCustomer.fulfilled, (state) => {
        state.createStatus = 'succeeded';
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createError = (action.payload as string) || action.error.message || 'Failed to create customer';
      });

    // Update Reducers
    builder
      .addCase(updateCustomer.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        state.updateError = null;
        if (action.payload?.customer) {
          if (state.selectedCustomer?.id === action.payload.customer.id) {
            state.selectedCustomer = action.payload.customer;
          }
          const idx = state.customers.findIndex(c => c.id === action.payload.customer.id);
          if (idx !== -1) {
            state.customers[idx] = action.payload.customer;
          }
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = (action.payload as string) || action.error.message || 'Failed to update customer';
      });

    // Delete Reducers
    builder
      .addCase(deleteCustomer.pending, (state) => {
        state.deleteStatus = 'loading';
        state.deleteError = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        state.deleteError = null;
        state.customers = state.customers.filter(customer => customer.id !== action.payload.id);
        if (state.selectedCustomer?.id === action.payload.id) {
          state.selectedCustomer = null;
          state.currentDetailId = null;
          state.detailStatus = 'idle';
          state.detailError = null;
        }
        state.childCustomers = state.childCustomers.filter(
          c => c.id !== action.payload.id && c.parentCustomerId !== action.payload.id
        );
        if (state.currentContactsCustomerId === action.payload.id) {
          state.contacts = [];
          state.selectedContact = null;
          state.currentContactsCustomerId = null;
          state.contactsStatus = 'idle';
          state.contactsError = null;
        }
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.deleteError = (action.payload as string) || action.error.message || 'Failed to delete customer';
      });

    // Customer Contacts List Reducers
    builder
      .addCase(fetchCustomerContacts.pending, (state, action) => {
        state.currentContactsCustomerId = action.meta.arg;
        state.contactsStatus = 'loading';
        state.contactsError = null;
      })
      .addCase(fetchCustomerContacts.fulfilled, (state, action) => {
        if (state.currentContactsCustomerId === action.payload.customerId) {
          state.contactsStatus = 'succeeded';
          state.contacts = action.payload.contacts;
        }
      })
      .addCase(fetchCustomerContacts.rejected, (state, action) => {
        if (state.currentContactsCustomerId === action.meta.arg) {
          state.contactsStatus = 'failed';
          state.contactsError =
            (action.payload as string) ||
            action.error.message ||
            'Failed to load customer contacts';
        }
      });

    // Single Contact Detail Reducers
    builder
      .addCase(fetchCustomerContactById.pending, (state) => {
        state.contactDetailStatus = 'loading';
        state.contactDetailError = null;
      })
      .addCase(fetchCustomerContactById.fulfilled, (state, action) => {
        state.contactDetailStatus = 'succeeded';
        state.selectedContact = action.payload.contact;
        // Keep list item synchronized if list is loaded for this customer
        if (state.currentContactsCustomerId === action.payload.customerId) {
          const idx = state.contacts.findIndex(c => c.id === action.payload.contact.id);
          if (idx !== -1) {
            state.contacts[idx] = action.payload.contact;
          }
        }
      })
      .addCase(fetchCustomerContactById.rejected, (state, action) => {
        state.contactDetailStatus = 'failed';
        state.contactDetailError =
          (action.payload as string) ||
          action.error.message ||
          'Failed to load contact details';
      });

    // Create Contact Reducers
    builder
      .addCase(createCustomerContact.pending, (state) => {
        state.createContactStatus = 'loading';
        state.createContactError = null;
      })
      .addCase(createCustomerContact.fulfilled, (state, action) => {
        state.createContactStatus = 'succeeded';
        const { customerId, contact } = action.payload;
        if (state.currentContactsCustomerId === customerId) {
          // If the new contact is primary, unmark any existing primary in local state
          if (contact.isPrimary) {
            state.contacts = state.contacts.map(c =>
              c.isPrimary ? { ...c, isPrimary: false } : c
            );
          }
          state.contacts.unshift(contact);
        }
      })
      .addCase(createCustomerContact.rejected, (state, action) => {
        state.createContactStatus = 'failed';
        state.createContactError =
          (action.payload as string) || action.error.message || 'Failed to create contact';
      });

    // Update Contact Reducers
    builder
      .addCase(updateCustomerContact.pending, (state) => {
        state.updateContactStatus = 'loading';
        state.updateContactError = null;
      })
      .addCase(updateCustomerContact.fulfilled, (state, action) => {
        state.updateContactStatus = 'succeeded';
        const { customerId, contact } = action.payload;
        if (state.currentContactsCustomerId === customerId) {
          if (contact.isPrimary) {
            state.contacts = state.contacts.map(c =>
              c.id === contact.id ? contact : c.isPrimary ? { ...c, isPrimary: false } : c
            );
          } else {
            state.contacts = state.contacts.map(c =>
              c.id === contact.id ? contact : c
            );
          }
        }
        if (state.selectedContact?.id === contact.id) {
          state.selectedContact = contact;
        }
      })
      .addCase(updateCustomerContact.rejected, (state, action) => {
        state.updateContactStatus = 'failed';
        state.updateContactError =
          (action.payload as string) || action.error.message || 'Failed to update contact';
      });

    // Delete Contact Reducers
    builder
      .addCase(deleteCustomerContact.pending, (state) => {
        state.deleteContactStatus = 'loading';
        state.deleteContactError = null;
      })
      .addCase(deleteCustomerContact.fulfilled, (state, action) => {
        state.deleteContactStatus = 'succeeded';
        const { customerId, contactId } = action.payload;
        if (state.currentContactsCustomerId === customerId) {
          state.contacts = state.contacts.filter(c => c.id !== contactId);
        }
        if (state.selectedContact?.id === contactId) {
          state.selectedContact = null;
        }
      })
      .addCase(deleteCustomerContact.rejected, (state, action) => {
        state.deleteContactStatus = 'failed';
        state.deleteContactError =
          (action.payload as string) || action.error.message || 'Failed to delete contact';
      });
  },
});

export const { 
  clearSelectedCustomer, 
  clearChildCustomers,
  clearContacts,
  resetCreateState, 
  resetUpdateState, 
  resetDeleteState,
  resetContactMutationStates,
} = customersSlice.actions;

// Selectors
export const selectCustomers = (state: { customers: CustomersState }) => state.customers.customers;
export const selectSelectedCustomer = (state: { customers: CustomersState }) => state.customers.selectedCustomer;
export const selectChildCustomers = (state: { customers: CustomersState }) => state.customers.childCustomers;
export const selectCustomerContacts = (state: { customers: CustomersState }) => state.customers.contacts;
export const selectSelectedContact = (state: { customers: CustomersState }) => state.customers.selectedContact;
export const selectPrimaryContact = (state: { customers: CustomersState }) =>
  state.customers.contacts.find(c => c.isPrimary) || null;

export const selectCustomersListStatus = (state: { customers: CustomersState }) => state.customers.listStatus;
export const selectCustomersDetailStatus = (state: { customers: CustomersState }) => state.customers.detailStatus;
export const selectCustomerChildrenStatus = (state: { customers: CustomersState }) => state.customers.childrenStatus;
export const selectCustomerContactsStatus = (state: { customers: CustomersState }) => state.customers.contactsStatus;
export const selectContactDetailStatus = (state: { customers: CustomersState }) => state.customers.contactDetailStatus;
export const selectCreateContactStatus = (state: { customers: CustomersState }) => state.customers.createContactStatus;
export const selectUpdateContactStatus = (state: { customers: CustomersState }) => state.customers.updateContactStatus;
export const selectDeleteContactStatus = (state: { customers: CustomersState }) => state.customers.deleteContactStatus;

export const selectCreateCustomerStatus = (state: { customers: CustomersState }) => state.customers.createStatus;
export const selectUpdateCustomerStatus = (state: { customers: CustomersState }) => state.customers.updateStatus;
export const selectDeleteCustomerStatus = (state: { customers: CustomersState }) => state.customers.deleteStatus;

export const selectCustomersListError = (state: { customers: CustomersState }) => state.customers.listError;
export const selectCustomersDetailError = (state: { customers: CustomersState }) => state.customers.detailError;
export const selectCustomerChildrenError = (state: { customers: CustomersState }) => state.customers.childrenError;
export const selectCustomerContactsError = (state: { customers: CustomersState }) => state.customers.contactsError;
export const selectContactDetailError = (state: { customers: CustomersState }) => state.customers.contactDetailError;
export const selectCreateContactError = (state: { customers: CustomersState }) => state.customers.createContactError;
export const selectUpdateContactError = (state: { customers: CustomersState }) => state.customers.updateContactError;
export const selectDeleteContactError = (state: { customers: CustomersState }) => state.customers.deleteContactError;

export const selectCreateCustomerError = (state: { customers: CustomersState }) => state.customers.createError;
export const selectUpdateCustomerError = (state: { customers: CustomersState }) => state.customers.updateError;
export const selectDeleteCustomerError = (state: { customers: CustomersState }) => state.customers.deleteError;

export default customersSlice.reducer;
