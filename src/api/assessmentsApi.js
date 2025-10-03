// src/api/assessmentsApi.js
// Persist assessments (builders) and candidate responses in localStorage
import { v4 as uuidv4 } from "uuid";

const ASSESSMENTS_KEY = "assessments";             // array of assessment builder objects
const RESPONSES_KEY = "assessment_responses_v1";   // object { assessmentId: [responses...] }

function delay(ms = 200) { return new Promise(res => setTimeout(res, ms)); }

/** Get all assessments or by jobId */
export async function getAssessments({ jobId = null } = {}) {
  await delay();
  const all = JSON.parse(localStorage.getItem(ASSESSMENTS_KEY) || "[]");
  return jobId ? all.filter(a => a.jobId === jobId) : all;
}

/** Get single assessment */
export async function getAssessmentById(id) {
  await delay();
  const all = JSON.parse(localStorage.getItem(ASSESSMENTS_KEY) || "[]");
  return all.find(a => a.id === id) || null;
}

/** Create or update an assessment (builder) */
export async function saveAssessment(assessment) {
  await delay();
  const all = JSON.parse(localStorage.getItem(ASSESSMENTS_KEY) || "[]");
  if (assessment.id) {
    const idx = all.findIndex(a => a.id === assessment.id);
    if (idx === -1) throw new Error("Assessment not found");
    all[idx] = { ...all[idx], ...assessment, updatedAt: Date.now() };
    localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(all));
    return all[idx];
  } else {
    const newA = { ...assessment, id: uuidv4(), createdAt: Date.now(), updatedAt: Date.now() };
    all.push(newA);
    localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(all));
    return newA;
  }
}

/** Delete (soft remove) */
export async function deleteAssessment(id) {
  await delay();
  const all = JSON.parse(localStorage.getItem(ASSESSMENTS_KEY) || "[]");
  const filtered = all.filter(a => a.id !== id);
  localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(filtered));
  return id;
}

/** Save a candidate response for an assessment */
export async function saveResponse(assessmentId, responsePayload) {
  await delay();
  const store = JSON.parse(localStorage.getItem(RESPONSES_KEY) || "{}");
  const arr = store[assessmentId] || [];
  const entry = { id: uuidv4(), at: Date.now(), response: responsePayload };
  store[assessmentId] = [...arr, entry];
  localStorage.setItem(RESPONSES_KEY, JSON.stringify(store));
  return entry;
}

/** Get responses for an assessment */
export async function getResponses(assessmentId) {
  await delay();
  const store = JSON.parse(localStorage.getItem(RESPONSES_KEY) || "{}");
  return store[assessmentId] || [];
}
