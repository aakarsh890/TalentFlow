import React from "react";
import JobsBoard from "../features/jobs/JobsBoard";


const JobsPage = () => {
  return (
    <div className="jobs-page">
      <div className="jobs-content">
        <JobsBoard />
      </div>
    </div>
  );
};

export default JobsPage;
