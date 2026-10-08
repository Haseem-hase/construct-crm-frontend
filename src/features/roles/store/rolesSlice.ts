import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { OrganizationRole } from '../types/roles.types';
import { rolesApi } from '../api/roles.api';

export interface RolesState {
  roles: OrganizationRole[];
  selectedRole: OrganizationRole | null;
  listStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  detailStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  listError: string | null;
  detailError: string | null;
}

const initialState: RolesState = {
  roles: [],
  selectedRole: null,
  listStatus: 'idle',
  detailStatus: 'idle',
  listError: null,
  detailError: null,
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

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    clearSelectedRole: (state) => {
      state.selectedRole = null;
      state.detailStatus = 'idle';
      state.detailError = null;
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
  },
});

export const { clearSelectedRole } = rolesSlice.actions;

// Selectors
export const selectRoles = (state: { roles: RolesState }) => state.roles.roles;
export const selectSelectedRole = (state: { roles: RolesState }) => state.roles.selectedRole;
export const selectRolesListStatus = (state: { roles: RolesState }) => state.roles.listStatus;
export const selectRolesDetailStatus = (state: { roles: RolesState }) => state.roles.detailStatus;
export const selectRolesListError = (state: { roles: RolesState }) => state.roles.listError;
export const selectRolesDetailError = (state: { roles: RolesState }) => state.roles.detailError;

export default rolesSlice.reducer;
