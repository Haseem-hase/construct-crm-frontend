import { configureStore } from '@reduxjs/toolkit';
import permissionsReducer from '../features/roles/store/permissionsSlice';
import rolesReducer from '../features/roles/store/rolesSlice';
import customersReducer from '../features/customers/store/customersSlice';
import contractorsReducer from '../features/contractors/store/contractorsSlice';
import projectsReducer from '../features/projects/store/projectsSlice';

export const store = configureStore({
  reducer: {
    permissions: permissionsReducer,
    roles: rolesReducer,
    customers: customersReducer,
    contractors: contractorsReducer,
    projects: projectsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
