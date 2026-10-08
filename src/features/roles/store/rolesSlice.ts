import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { OrganizationRole, CreateRoleRequest, UpdateRoleRequest } from '../types/roles.types';
import { rolesApi } from '../api/roles.api';

export interface RolesState {
  roles: OrganizationRole[];
  selectedRole: OrganizationRole | null;
  listStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  detailStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  createStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  deleteStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  listError: string | null;
  detailError: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
}

const initialState: RolesState = {
  roles: [],
  selectedRole: null,
  listStatus: 'idle',
  detailStatus: 'idle',
  createStatus: 'idle',
  updateStatus: 'idle',
  deleteStatus: 'idle',
  listError: null,
  detailError: null,
  createError: null,
  updateError: null,
  deleteError: null,
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

export const updateRole = createAsyncThunk(
  'roles/updateRole',
  async ({ id, payload }: { id: string; payload: UpdateRoleRequest }, { rejectWithValue, dispatch }) => {
    try {
      const response = await rolesApi.updateRole(id, payload);
      // Refetch the role details and the roles list to ensure relations like permissions are populated
      dispatch(fetchRoleById(id));
      dispatch(fetchRoles());
      return response.data.role;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to update role');
    }
  }
);

export const deleteRole = createAsyncThunk(
  'roles/deleteRole',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await rolesApi.deleteRole(id);
      return { id, ...response };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to delete role');
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

    // Update Reducers
    builder
      .addCase(updateRole.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        // We rely on fetchRoleById and fetchRoles being dispatched by the thunk to update the state
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = (action.payload as string) || action.error.message || 'Failed to update role';
      });

    // Delete Reducers
    builder
      .addCase(deleteRole.pending, (state) => {
        state.deleteStatus = 'loading';
        state.deleteError = null;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        state.roles = state.roles.filter(role => role.id !== action.payload.id);
        if (state.selectedRole?.id === action.payload.id) {
          state.selectedRole = null;
          state.detailStatus = 'idle';
        }
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.deleteError = (action.payload as string) || action.error.message || 'Failed to delete role';
      });
  },
});

export const { clearSelectedRole, resetCreateState, resetUpdateState, resetDeleteState } = rolesSlice.actions;

// Selectors
export const selectRoles = (state: { roles: RolesState }) => state.roles.roles;
export const selectSelectedRole = (state: { roles: RolesState }) => state.roles.selectedRole;
export const selectRolesListStatus = (state: { roles: RolesState }) => state.roles.listStatus;
export const selectRolesDetailStatus = (state: { roles: RolesState }) => state.roles.detailStatus;
export const selectRolesListError = (state: { roles: RolesState }) => state.roles.listError;
export const selectRolesDetailError = (state: { roles: RolesState }) => state.roles.detailError;
export const selectCreateRoleStatus = (state: { roles: RolesState }) => state.roles.createStatus;
export const selectCreateRoleError = (state: { roles: RolesState }) => state.roles.createError;
export const selectUpdateRoleStatus = (state: { roles: RolesState }) => state.roles.updateStatus;
export const selectUpdateRoleError = (state: { roles: RolesState }) => state.roles.updateError;
export const selectDeleteRoleStatus = (state: { roles: RolesState }) => state.roles.deleteStatus;
export const selectDeleteRoleError = (state: { roles: RolesState }) => state.roles.deleteError;

export default rolesSlice.reducer;
