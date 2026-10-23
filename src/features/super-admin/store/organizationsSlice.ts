import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { organizationsApi } from '../api/organizations.api';
import { Organization, OrganizationListQuery, OrganizationPagination } from '../types/organizations.types';

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface OrganizationsState {
  organizations: Organization[];
  pagination: OrganizationPagination | null;
  listStatus: RequestStatus;
  listError: string | null;
  activeListRequestId: string | null;
  createStatus: RequestStatus;
  createError: string | null;
}

const initialState: OrganizationsState = {
  organizations: [],
  pagination: null,
  listStatus: 'idle',
  listError: null,
  activeListRequestId: null,
  createStatus: 'idle',
  createError: null,
};

function getErrorMessage(error: unknown, fallback: string): string {
  const responseData = (error as { response?: { data?: { message?: string; errors?: Array<{ message?: string }> } } })?.response?.data;
  return responseData?.message || responseData?.errors?.find((item) => item.message)?.message || fallback;
}

export const fetchOrganizations = createAsyncThunk<
  Awaited<ReturnType<typeof organizationsApi.list>>,
  OrganizationListQuery,
  { rejectValue: string }
>('organizations/fetch', async (query, { rejectWithValue }) => {
  try {
    return await organizationsApi.list(query);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Unable to load organizations.'));
  }
});

const organizationsSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {
    organizationCreateStarted(state) {
      state.createStatus = 'loading';
      state.createError = null;
    },
    organizationCreateSucceeded(state) {
      state.createStatus = 'succeeded';
      state.createError = null;
    },
    organizationCreateFailed(state, action: PayloadAction<string>) {
      state.createStatus = 'failed';
      state.createError = action.payload;
    },
    resetOrganizationCreate(state) {
      state.createStatus = 'idle';
      state.createError = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOrganizations.pending, (state, action) => {
        state.activeListRequestId = action.meta.requestId;
        state.listStatus = 'loading';
        state.listError = null;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        if (state.activeListRequestId !== action.meta.requestId) return;
        state.organizations = action.payload.organizations;
        state.pagination = action.payload.pagination;
        state.listStatus = 'succeeded';
        state.activeListRequestId = null;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        if (state.activeListRequestId !== action.meta.requestId) return;
        state.listStatus = action.meta.aborted ? 'idle' : 'failed';
        state.listError = action.meta.aborted ? null : action.payload || action.error.message || 'Unable to load organizations.';
        state.activeListRequestId = null;
      });
  },
});

export const {
  organizationCreateStarted,
  organizationCreateSucceeded,
  organizationCreateFailed,
  resetOrganizationCreate,
} = organizationsSlice.actions;
export const selectOrganizations = (state: { organizations: OrganizationsState }) => state.organizations.organizations;
export const selectOrganizationsPagination = (state: { organizations: OrganizationsState }) => state.organizations.pagination;
export const selectOrganizationsListStatus = (state: { organizations: OrganizationsState }) => state.organizations.listStatus;
export const selectOrganizationsListError = (state: { organizations: OrganizationsState }) => state.organizations.listError;
export const selectOrganizationCreateStatus = (state: { organizations: OrganizationsState }) => state.organizations.createStatus;
export const selectOrganizationCreateError = (state: { organizations: OrganizationsState }) => state.organizations.createError;

export default organizationsSlice.reducer;
