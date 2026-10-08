import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Permission } from '../types/roles.types';
import { permissionsApi } from '../api/permissions.api';

export interface PermissionsState {
  permissions: Permission[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PermissionsState = {
  permissions: [],
  status: 'idle',
  error: null,
};

export const fetchPermissions = createAsyncThunk(
  'permissions/fetchPermissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await permissionsApi.getPermissions();
      return response.data.permissions;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to load permissions');
    }
  }
);

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.permissions = action.payload;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || action.error.message || 'Failed to fetch permissions';
      });
  },
});

export const selectPermissions = (state: { permissions: PermissionsState }) => state.permissions.permissions;
export const selectPermissionsStatus = (state: { permissions: PermissionsState }) => state.permissions.status;
export const selectPermissionsError = (state: { permissions: PermissionsState }) => state.permissions.error;

export default permissionsSlice.reducer;
