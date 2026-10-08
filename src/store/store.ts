import { configureStore } from '@reduxjs/toolkit';
import permissionsReducer from '../features/roles/store/permissionsSlice';
import rolesReducer from '../features/roles/store/rolesSlice';

export const store = configureStore({
  reducer: {
    permissions: permissionsReducer,
    roles: rolesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
