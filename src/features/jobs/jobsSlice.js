import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as jobsApi from "../../api/jobsApi";

export const fetchJobs = createAsyncThunk("jobs/fetch", async () => {
  return await jobsApi.getJobs();
});

export const createJob = createAsyncThunk("jobs/create", async (job) => {
  return await jobsApi.createJob(job);
});

export const updateJob = createAsyncThunk("jobs/update", async (job) => {
  return await jobsApi.updateJob(job.id, job);
});

export const toggleArchiveJob = createAsyncThunk(
  "jobs/archive",
  async (id, { getState }) => {
    const job = getState().jobs.list.find((j) => j.id === id);
    return {
      ...job,
      archived: !job.archived,  // toggle archived flag
    };
  }
);


const jobsSlice = createSlice({
  name: "jobs",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {
    reorderJobs: (state, action) => {
      state.list = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        // put newest at top
        state.list.unshift(action.payload);
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        const idx = state.list.findIndex((j) => j.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(toggleArchiveJob.fulfilled, (state, action) => {
        const idx = state.list.findIndex((j) => j.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      });
  },
});

export const { reorderJobs } = jobsSlice.actions;
export default jobsSlice.reducer;
