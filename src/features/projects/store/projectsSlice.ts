import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { projectsApi, ApiProject, ProjectPayload } from '../api/projects.api';

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
interface ProjectsState {
  selectedProject: ApiProject | null;
  currentDetailId: string | null;
  detailStatus: RequestStatus;
  updateStatus: RequestStatus;
  createStatus: RequestStatus;
  detailError: string | null;
  createError: string | null;
  updateError: string | null;
}

const initialState: ProjectsState = { selectedProject: null, currentDetailId: null, detailStatus: 'idle', updateStatus: 'idle', createStatus: 'idle', detailError: null, createError: null, updateError: null };
const messageFrom = (error: any, fallback: string) => error?.response?.data?.message || error?.response?.data?.errors?.[0]?.message || fallback;

export const fetchProjectById = createAsyncThunk<ApiProject, string, { rejectValue: string }>(
  'projects/fetchById', async (id, { rejectWithValue }) => {
    try { return await projectsApi.get(id); }
    catch (error) { return rejectWithValue(messageFrom(error, 'Failed to load project details.')); }
  }
);

export const updateProject = createAsyncThunk<ApiProject, { id: string; payload: Partial<ProjectPayload> }, { rejectValue: string }>(
  'projects/update', async ({ id, payload }, { rejectWithValue }) => {
    try { return await projectsApi.update(id, payload); }
    catch (error) { return rejectWithValue(messageFrom(error, 'Failed to update project.')); }
  }
);

export const createProject = createAsyncThunk<ApiProject, ProjectPayload, { rejectValue: string }>(
  'projects/create', async (payload, { rejectWithValue }) => {
    try { return await projectsApi.create(payload); }
    catch (error) { return rejectWithValue(messageFrom(error, 'Failed to create project.')); }
  }
);

const projectsSlice = createSlice({
  name: 'projects', initialState, reducers: {
    clearSelectedProject(state) { state.selectedProject = null; state.currentDetailId = null; state.detailStatus = 'idle'; state.detailError = null; state.updateStatus = 'idle'; state.updateError = null; },
    resetProjectUpdate(state) { state.updateStatus = 'idle'; state.updateError = null; },
  }, extraReducers(builder) {
    builder
      .addCase(fetchProjectById.pending, (state, action) => { state.currentDetailId = action.meta.arg; state.selectedProject = null; state.detailStatus = 'loading'; state.detailError = null; })
      .addCase(fetchProjectById.fulfilled, (state, action) => { if (state.currentDetailId === action.meta.arg) { state.selectedProject = action.payload; state.detailStatus = 'succeeded'; } })
      .addCase(fetchProjectById.rejected, (state, action) => { if (state.currentDetailId === action.meta.arg) { state.detailStatus = 'failed'; state.detailError = action.payload || action.error.message || 'Failed to load project details.'; } })
      .addCase(updateProject.pending, (state) => { state.updateStatus = 'loading'; state.updateError = null; })
      .addCase(updateProject.fulfilled, (state, action) => { state.updateStatus = 'succeeded'; if (state.selectedProject?.id === action.payload.id) state.selectedProject = { ...state.selectedProject, ...action.payload }; })
      .addCase(updateProject.rejected, (state, action) => { state.updateStatus = 'failed'; state.updateError = action.payload || action.error.message || 'Failed to update project.'; });
    builder
      .addCase(createProject.pending, (state) => { state.createStatus = 'loading'; state.createError = null; })
      .addCase(createProject.fulfilled, (state) => { state.createStatus = 'succeeded'; })
      .addCase(createProject.rejected, (state, action) => { state.createStatus = 'failed'; state.createError = action.payload || action.error.message || 'Failed to create project.'; });
  },
});

export const { clearSelectedProject, resetProjectUpdate } = projectsSlice.actions;
export const selectSelectedProject = (state: { projects: ProjectsState }) => state.projects.selectedProject;
export const selectProjectDetailStatus = (state: { projects: ProjectsState }) => state.projects.detailStatus;
export const selectProjectDetailError = (state: { projects: ProjectsState }) => state.projects.detailError;
export const selectProjectUpdateStatus = (state: { projects: ProjectsState }) => state.projects.updateStatus;
export const selectProjectUpdateError = (state: { projects: ProjectsState }) => state.projects.updateError;
export const selectProjectCreateStatus = (state: { projects: ProjectsState }) => state.projects.createStatus;
export const selectProjectCreateError = (state: { projects: ProjectsState }) => state.projects.createError;
export default projectsSlice.reducer;
