// utils/mockData.js
import { CandidateStages, JobStatus } from "./constants";
import { v4 as uuid } from "uuid";

export const generateMockJobs = (count = 10) =>
  Array.from({ length: count }, (_, i) => ({
    id: uuid(),
    title: `Job Title ${i + 1}`,
    slug: `job-title-${i + 1}`,
    status: i % 2 === 0 ? JobStatus.ACTIVE : JobStatus.ARCHIVED,
    tags: ["Engineering", "HR", "Marketing"].filter(() => Math.random() > 0.5),
  }));

export const generateMockCandidates = (count = 1000) =>
  Array.from({ length: count }, (_, i) => ({
    id: uuid(),
    name: `Candidate ${i + 1}`,
    email: `candidate${i + 1}@example.com`,
    stage: CandidateStages[Math.floor(Math.random() * CandidateStages.length)],
    notes: [],
    timeline: [`Applied on ${new Date().toLocaleDateString()}`],
  }));
