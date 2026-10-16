import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  ApiContractor,
  CreateContractorRequest,
  UpdateContractorRequest,
} from '../types/contractor.types';
import { contractorsApi } from '../api/contractors.api';

export interface ContractorsState {
  contractors: ApiContractor[];
  selectedContractor: ApiContractor | null;
  currentDetailId: string | null;
  listStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  detailStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  listError: string | null;
  detailError: string | null;
  createError: string | null;
  updateError: string | null;
}

const initialState: ContractorsState = {
  contractors: [],
  selectedContractor: null,
  currentDetailId: null,
  listStatus: 'idle',
  detailStatus: 'idle',
  createStatus: 'idle',
  updateStatus: 'idle',
  listError: null,
  detailError: null,
  createError: null,
  updateError: null,
};

export const fetchContractors = createAsyncThunk(
  'contractors/fetchContractors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await contractorsApi.getContractors();
      return response.data.contractors;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message ||
        'Failed to load contractors';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchContractorById = createAsyncThunk(
  'contractors/fetchContractorById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await contractorsApi.getContractorById(id);
      return response.data.contractor;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message ||
        'Failed to load contractor details';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createContractor = createAsyncThunk(
  'contractors/createContractor',
  async (payload: CreateContractorRequest, { rejectWithValue }) => {
    try {
      const response = await contractorsApi.createContractor(payload);
      return { contractor: response.data.contractor, message: response.message };
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message ||
        'Failed to create contractor';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateContractor = createAsyncThunk(
  'contractors/updateContractor',
  async (
    { id, payload }: { id: string; payload: UpdateContractorRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await contractorsApi.updateContractor(id, payload);
      return { contractor: response.data.contractor, message: response.message };
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message ||
        'Failed to update contractor';
      return rejectWithValue(errorMessage);
    }
  }
);

const contractorsSlice = createSlice({
  name: 'contractors',
  initialState,
  reducers: {
    clearSelectedContractor: (state) => {
      state.selectedContractor = null;
      state.currentDetailId = null;
      state.detailStatus = 'idle';
      state.detailError = null;
    },
    resetCreateState: (state) => {
      state.createStatus = 'idle';
      state.createError = null;
    },
    resetUpdateState: (state) => {
      state.updateStatus = 'idle';
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    // List Reducers
    builder
      .addCase(fetchContractors.pending, (state) => {
        state.listStatus = 'loading';
        state.listError = null;
      })
      .addCase(fetchContractors.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.contractors = action.payload;
      })
      .addCase(fetchContractors.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.listError =
          (action.payload as string) || action.error.message || 'Failed to fetch contractors';
      });

    // Detail Reducers
    builder
      .addCase(fetchContractorById.pending, (state, action) => {
        state.currentDetailId = action.meta.arg;
        state.detailStatus = 'loading';
        state.detailError = null;
      })
      .addCase(fetchContractorById.fulfilled, (state, action) => {
        if (state.currentDetailId === action.meta.arg) {
          state.detailStatus = 'succeeded';
          state.selectedContractor = action.payload;
        }
      })
      .addCase(fetchContractorById.rejected, (state, action) => {
        if (state.currentDetailId === action.meta.arg) {
          state.detailStatus = 'failed';
          state.detailError =
            (action.payload as string) || action.error.message || 'Failed to fetch contractor details';
        }
      });

    // Create Reducers
    builder
      .addCase(createContractor.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = null;
      })
      .addCase(createContractor.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.createError = null;
        if (action.payload?.contractor) {
          state.contractors.unshift(action.payload.contractor);
        }
      })
      .addCase(createContractor.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createError =
          (action.payload as string) || action.error.message || 'Failed to create contractor';
      });

    // Update Reducers
    builder
      .addCase(updateContractor.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateContractor.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        state.updateError = null;
        if (action.payload?.contractor) {
          const updated = action.payload.contractor;
          if (state.selectedContractor?.id === updated.id) {
            state.selectedContractor = updated;
          }
          const idx = state.contractors.findIndex((c) => c.id === updated.id);
          if (idx !== -1) {
            state.contractors[idx] = updated;
          }
        }
      })
      .addCase(updateContractor.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError =
          (action.payload as string) || action.error.message || 'Failed to update contractor';
      });
  },
});

export const {
  clearSelectedContractor,
  resetCreateState,
  resetUpdateState,
} = contractorsSlice.actions;

// Selectors
export const selectContractors = (state: { contractors: ContractorsState }) =>
  state.contractors.contractors;
export const selectSelectedContractor = (state: { contractors: ContractorsState }) =>
  state.contractors.selectedContractor;
export const selectContractorsListStatus = (state: { contractors: ContractorsState }) =>
  state.contractors.listStatus;
export const selectContractorsListError = (state: { contractors: ContractorsState }) =>
  state.contractors.listError;
export const selectContractorDetailStatus = (state: { contractors: ContractorsState }) =>
  state.contractors.detailStatus;
export const selectContractorDetailError = (state: { contractors: ContractorsState }) =>
  state.contractors.detailError;
export const selectCreateContractorStatus = (state: { contractors: ContractorsState }) =>
  state.contractors.createStatus;
export const selectCreateContractorError = (state: { contractors: ContractorsState }) =>
  state.contractors.createError;
export const selectUpdateContractorStatus = (state: { contractors: ContractorsState }) =>
  state.contractors.updateStatus;
export const selectUpdateContractorError = (state: { contractors: ContractorsState }) =>
  state.contractors.updateError;

export default contractorsSlice.reducer;
