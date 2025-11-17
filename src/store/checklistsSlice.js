import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllChecklists, createChecklist, updateChecklist, deleteChecklist } from '../services/api';

// Thunks asynchrones
export const fetchChecklists = createAsyncThunk(
  'checklists/fetchChecklists',
  async () => {
    const response = await getAllChecklists();
    return response.response || []; // selon le format de ta réponse API
  }
);

export const addChecklistThunk = createAsyncThunk(
  'checklists/addChecklist',
  async (newChecklist) => {
    const response = await createChecklist(newChecklist);
    return response.response || response; 
  }
);

export const updateChecklistThunk = createAsyncThunk(
  'checklists/updateChecklist',
  async (updatedChecklist) => {
    const { id, ...data } = updatedChecklist;
    const response = await updateChecklist(id, data);
    return response.response || response;
  }
);

export const deleteChecklistThunk = createAsyncThunk(
  'checklists/deleteChecklist',
  async (id) => {
    await deleteChecklist(id);
    return id;
  }
);

const checklistsSlice = createSlice({
  name: 'checklists',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchChecklists.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchChecklists.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchChecklists.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Add
      .addCase(addChecklistThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update
      .addCase(updateChecklistThunk.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      // Delete
      .addCase(deleteChecklistThunk.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c.id !== action.payload);
      });
  },
});

export default checklistsSlice.reducer;
