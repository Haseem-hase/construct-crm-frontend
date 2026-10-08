import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { OrganizationRole, CreateRoleRequest } from '../types/roles.types';
import { rolesApi } from '../api/roles.api';

export interface RolesState {
  roles: OrganizationRole[];
  selectedRole: OrganizationRole | null;
  listStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  detailStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  listError: string | null;
  detailError: string | null;
  createError: string | null;
}

const initialState: RolesState = {
  roles: [],
  selectedRole: null,
  listStatus: 'idle',
  detailStatus: 'idle',
  createStatus: 'idle',
  listError: null,
  detailError: null,
  createError: null,
};

export const fetchRoles = createAsyncThunk(
  'roles/fetchRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await rolesApi.getRoles();
      return response.data.roles;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to load roles');
    }
  }
);

export const fetchRoleById = createAsyncThunk(
  'roles/fetchRoleById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await rolesApi.getRole(id);
      return response.data.role;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to load role details');
    }
  }
);

export const createRole = createAsyncThunk(
  'roles/createRole',
  async (payload: CreateRoleRequest, { rejectWithValue, dispatch }) => {
    try {
      const response = await rolesApi.createRole(payload);
      // Dispatch fetchRoles to refresh the list since a new role was added
      dispatch(fetchRoles());
      return response.data.role;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to create role');
    }
  }
);

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    clearSelectedRole: (state) => {
      state.selectedRole = null;
      state.detailStatus = 'idle';
      state.detailError = null;
    },
    resetCreateState: (state) => {
      state.createStatus = 'idle';
      state.createError = null;
    }
  },
  extraReducers: (builder) => {
    // List Reducers
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.listStatus = 'loading';
        state.listError = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.listError = (action.payload as string) || action.error.message || 'Failed to fetch roles';
      });

    // Detail Reducers
    builder
      .addCase(fetchRoleById.pending, (state) => {
        state.detailStatus = 'loading';
        state.detailError = null;
        state.selectedRole = null;
      })
      .addCase(fetchRoleById.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.selectedRole = action.payload;
      })
      .addCase(fetchRoleById.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.detailError = (action.payload as string) || action.error.message || 'Failed to fetch role details';
      });

    // Create Reducers
    builder
      .addCase(createRole.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        // We rely on fetchRoles being dispatched by the thunk to update the roles list
      })
      .addCase(createRole.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createError = (action.payload as string) || action.error.message || 'Failed to create role';
      });
  },
});

export const { clearSelectedRole, resetCreateState } = rolesSlice.actions;

// Selectors
export const selectRoles = (state: { roles: RolesState }) => state.roles.roles;
export const selectSelectedRole = (state: { roles: RolesState }) => state.roles.selectedRole;
export const selectRolesListStatus = (state: { roles: RolesState }) => state.roles.listStatus;
export const selectRolesDetailStatus = (state: { roles: RolesState }) => state.roles.detailStatus;
export const selectRolesListError = (state: { roles: RolesState }) => state.roles.listError;
export const selectRolesDetailError = (state: { roles: RolesState }) => state.roles.detailError;
export const selectCreateRoleStatus = (state: { roles: RolesState }) => state.roles.createStatus;
export const selectCreateRoleError = (state: { roles: RolesState }) => state.roles.createError;

export default rolesSlice.reducer;
