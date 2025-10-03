import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import JobsPage from "../pages/JobsPage";
import CandidatesPage from "../pages/CandidatesPage";
import AssessmentsPage from "../pages/AssessmentsPage";
import JobDetail from "../features/jobs/JobDetail";
import CandidateProfile from "../features/candidates/CandidateProfile";

const AppRouter = () => {
  return (
    <Routes>
      {/* Redirect root to /jobs */}
      <Route path="/" element={<Navigate to="/jobs" />} />

      {/* Jobs routes */}
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/jobs/:jobId" element={<JobDetail />} />

      {/* Candidates routes */}
      <Route path="/candidates" element={<CandidatesPage />} />
      <Route path="/candidates/:id" element={<CandidateProfile />} />

      {/* Assessments routes */}
      <Route
        path="/assessments"
        element={<AssessmentsPage candidateId="candidate1" />}
      />

      {/* Fallback route */}
      <Route path="*" element={<p className="p-4">Page Not Found</p>} />
    </Routes>
  );
};

export default AppRouter;
