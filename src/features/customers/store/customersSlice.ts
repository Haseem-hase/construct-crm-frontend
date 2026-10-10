import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '../types/customer.types';
import { customersApi } from '../api/customers.api';

export interface CustomersState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  childCustomers: Customer[];
  listStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  detailStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  childrenStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  deleteStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  listError: string | null;
  detailError: string | null;
  childrenError: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
}

const initialState: CustomersState = {
  customers: [],
  selectedCustomer: null,
  childCustomers: [],
  listStatus: 'idle',
  detailStatus: 'idle',
  childrenStatus: 'idle',
  createStatus: 'idle',
  updateStatus: 'idle',
  deleteStatus: 'idle',
  listError: null,
  detailError: null,
  childrenError: null,
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
      dispatch(fetchCustomerById(id));
      dispatch(fetchCustomers());
      return response.data.customer;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to update customer');
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
      return rejectWithValue(err?.response?.data?.message || 'Failed to delete customer');
    }
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
      state.detailStatus = 'idle';
      state.detailError = null;
    },
    clearChildCustomers: (state) => {
      state.childCustomers = [];
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
    }
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
      .addCase(fetchCustomerById.pending, (state) => {
        state.detailStatus = 'loading';
        state.detailError = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.selectedCustomer = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.detailError = (action.payload as string) || action.error.message || 'Failed to fetch customer details';
      });

    // Children Reducers
    builder
      .addCase(fetchCustomerChildren.pending, (state) => {
        state.childrenStatus = 'loading';
        state.childrenError = null;
      })
      .addCase(fetchCustomerChildren.fulfilled, (state, action) => {
        state.childrenStatus = 'succeeded';
        state.childCustomers = action.payload;
      })
      .addCase(fetchCustomerChildren.rejected, (state, action) => {
        state.childrenStatus = 'failed';
        state.childrenError = (action.payload as string) || action.error.message || 'Failed to fetch customer children';
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
      .addCase(updateCustomer.fulfilled, (state) => {
        state.updateStatus = 'succeeded';
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
        state.customers = state.customers.filter(customer => customer.id !== action.payload.id);
        if (state.selectedCustomer?.id === action.payload.id) {
          state.selectedCustomer = null;
          state.detailStatus = 'idle';
        }
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.deleteError = (action.payload as string) || action.error.message || 'Failed to delete customer';
      });
  },
});

export const { 
  clearSelectedCustomer, 
  clearChildCustomers,
  resetCreateState, 
  resetUpdateState, 
  resetDeleteState 
} = customersSlice.actions;

// Selectors
export const selectCustomers = (state: { customers: CustomersState }) => state.customers.customers;
export const selectSelectedCustomer = (state: { customers: CustomersState }) => state.customers.selectedCustomer;
export const selectChildCustomers = (state: { customers: CustomersState }) => state.customers.childCustomers;

export const selectCustomersListStatus = (state: { customers: CustomersState }) => state.customers.listStatus;
export const selectCustomersDetailStatus = (state: { customers: CustomersState }) => state.customers.detailStatus;
export const selectCustomerChildrenStatus = (state: { customers: CustomersState }) => state.customers.childrenStatus;
export const selectCreateCustomerStatus = (state: { customers: CustomersState }) => state.customers.createStatus;
export const selectUpdateCustomerStatus = (state: { customers: CustomersState }) => state.customers.updateStatus;
export const selectDeleteCustomerStatus = (state: { customers: CustomersState }) => state.customers.deleteStatus;

export const selectCustomersListError = (state: { customers: CustomersState }) => state.customers.listError;
export const selectCustomersDetailError = (state: { customers: CustomersState }) => state.customers.detailError;
export const selectCustomerChildrenError = (state: { customers: CustomersState }) => state.customers.childrenError;
export const selectCreateCustomerError = (state: { customers: CustomersState }) => state.customers.createError;
export const selectUpdateCustomerError = (state: { customers: CustomersState }) => state.customers.updateError;
export const selectDeleteCustomerError = (state: { customers: CustomersState }) => state.customers.deleteError;

export default customersSlice.reducer;
