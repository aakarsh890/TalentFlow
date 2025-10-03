// mock in-memory API
let jobs = [
  { id: 1, title: "Frontend Developer", slug: "frontend-developer", tags: ["React","CSS"], archived: false },
  { id: 2, title: "Backend Developer", slug: "backend-developer", tags: ["Node.js","MongoDB"], archived: false },
  { id: 3, title: "UI/UX Designer", slug: "ui-ux-designer", tags: ["Figma","Design"], archived: true },
];

const wait = (ms = 200) => new Promise((res) => setTimeout(res, ms));

export const getJobs = async (id) => {
  await wait();
  if (id != null) {
    const found = jobs.find((j) => Number(j.id) === Number(id));
    return found || null;
  }
  return [...jobs];
};

export const createJob = async (job) => {
  await wait();
  const newJob = { ...job, id: Date.now(), archived: false };
  jobs.unshift(newJob);
  return newJob;
};

export const updateJob = async (id, updatedJob) => {
  await wait();
  const idx = jobs.findIndex((j) => Number(j.id) === Number(id));
  if (idx === -1) throw new Error("Job not found");
  jobs[idx] = { ...jobs[idx], ...updatedJob };
  return jobs[idx];
};

export const archiveJob = async (id) => {
  await wait();
  const idx = jobs.findIndex((j) => Number(j.id) === Number(id));
  if (idx === -1) throw new Error("Job not found");
  jobs[idx].archived = !jobs[idx].archived;
  return jobs[idx];
};
