const STORAGE_KEY = "mock_candidates_v1";
const SIMULATED_DELAY = 250; // ms

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const uid = (prefix = "c") => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

// Seed some sample candidates (only used when localStorage is empty)
function seedCandidates() {
  const now = new Date().toISOString();
  const sampleStages = ["Applied", "Phone Screen", "Interview", "Offer", "Hired", "Rejected"];
  const sample = Array.from({ length: 20 }).map((_, i) => {
    const id = uid();
    const first = ["Asha", "Vikas", "Rina", "Karan", "Maya", "Rahul", "Sana", "Amit", "Priya", "Anil"][i % 10];
    const last = ["Patel", "Kumar", "Sharma", "Singh", "Mehta", "Gupta", "Rao", "Iyer", "Bose", "Verma"][i % 10];
    const stage = sampleStages[i % sampleStages.length];
    return {
      id,
      name: `${first} ${last}`,
      firstName: first,
      lastName: last,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
      stage,
      avatarUrl: null,
      // timeline entries: a couple of stage changes for demo
      timeline: [
        {
          id: uid("t"),
          type: "applied",
          note: "Application received",
          createdAt: now,
        },
        {
          id: uid("t"),
          type: "stage_change",
          from: "Applied",
          to: stage,
          actor: "recruiter_demo",
          note: `Moved to ${stage}`,
          createdAt: now,
        },
      ],
      notes: [
        {
          id: uid("n"),
          text: "Initial screen scheduled.",
          author: "recruiter_demo",
          createdAt: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };
  });
  return sample;
}

// Read/write from localStorage
function readStore() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to parse candidates store, reseeding.", e);
    return null;
  }
}

function writeStore(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// Ensure seeded data exists
(function ensureSeeded() {
  if (!readStore()) {
    const s = seedCandidates();
    writeStore(s);
  }
})();

// Public API

export async function getCandidates() {
  await sleep(SIMULATED_DELAY);
  const data = readStore() ?? [];
  return data;
}

export async function getCandidate(id) {
  await sleep(SIMULATED_DELAY);
  const list = readStore() ?? [];
  const found = list.find((c) => String(c.id) === String(id)) ?? null;
  return found;
}

export async function updateCandidate(id, patch = {}) {
  await sleep(SIMULATED_DELAY);
  const list = readStore() ?? [];
  const idx = list.findIndex((c) => String(c.id) === String(id));
  if (idx === -1) {
    return null;
  }
  const now = new Date().toISOString();
  const updated = {
    ...list[idx],
    ...patch,
    updatedAt: now,
  };
  list[idx] = updated;
  writeStore(list);
  return updated;
}

export async function addNoteToCandidate(id, noteText, author = "web_user") {
  await sleep(SIMULATED_DELAY);
  const list = readStore() ?? [];
  const idx = list.findIndex((c) => String(c.id) === String(id));
  if (idx === -1) return null;

  const now = new Date().toISOString();
  const note = {
    id: uid("n"),
    text: typeof noteText === "string" ? noteText : JSON.stringify(noteText),
    author,
    createdAt: now,
  };

  const candidate = { ...list[idx] };
  candidate.notes = Array.isArray(candidate.notes) ? [...candidate.notes, note] : [note];

  const tl = {
    id: uid("t"),
    type: "note",
    note: note.text,
    actor: author,
    createdAt: now,
  };
  candidate.timeline = Array.isArray(candidate.timeline) ? [...candidate.timeline, tl] : [tl];

  candidate.updatedAt = now;
  list[idx] = candidate;
  writeStore(list);

  return candidate;
}


export function resetMockData() {
  const s = seedCandidates();
  writeStore(s);
  return s;
}
