import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as candidatesApi from "../../api/candidatesApi";

// Async actions
export const fetchCandidates = createAsyncThunk("candidates/fetch", async () => {
  return await candidatesApi.getCandidates();
});

export const updateCandidateStage = createAsyncThunk("candidates/updateStage", async ({ id, stage }) => {
  return await candidatesApi.updateCandidate(id, { stage });
});

export const addCandidateNote = createAsyncThunk("candidates/addNote", async ({ id, note }) => {
  return await candidatesApi.addNoteToCandidate(id, note);
});

const candidatesSlice = createSlice({
  name: "candidates",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidates.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.status = "succeeded";
        // handle both axios-style {data: [...] } and direct array responses
        state.list = Array.isArray(action.payload?.data) ? action.payload.data : action.payload || [];
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateCandidateStage.fulfilled, (state, action) => {
        const updated = action.payload?.data ?? action.payload;
        if (!updated || !updated.id) return;
        const idx = state.list.findIndex((c) => c.id === updated.id);
        if (idx !== -1) state.list[idx] = updated;
        else state.list.push(updated);
      })
      .addCase(addCandidateNote.fulfilled, (state, action) => {
        const updated = action.payload?.data ?? action.payload;
        if (!updated || !updated.id) return;
        const idx = state.list.findIndex((c) => c.id === updated.id);
        if (idx !== -1) state.list[idx] = updated;
        else state.list.push(updated);
      });
  },
});

export default candidatesSlice.reducer;
