import { configureStore } from "@reduxjs/toolkit";
import jobsReducer from "../features/jobs/jobsSlice";
import candidatesReducer from "../features/candidates/candidatesSlice";

const store = configureStore({
  reducer: {
    jobs: jobsReducer,
    candidates: candidatesReducer,
    // assessments are managed via Zustand, so no reducer needed here
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
