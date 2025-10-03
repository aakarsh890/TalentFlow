import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobs } from "../../api/jobsApi";
import LoadingSpinner from "../../components/LoadingSpinner";

const JobDetail = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getJobs(jobId);
      setJob(data);
      setLoading(false);
    })();
  }, [jobId]);

  if (loading) return <LoadingSpinner />;

  if (!job) return <p className="p-4">Job not found.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{job.title}</h1>
      <p className="mt-2 text-gray-600">Slug: {job.slug}</p>
      <p className="mt-2">Status: {job.archived ? "Archived" : "Active"}</p>
      {job.tags && job.tags.length > 0 && (
        <p className="mt-2 text-sm text-gray-700">Tags: {job.tags.join(", ")}</p>
      )}
    </div>
  );
};

export default JobDetail;
