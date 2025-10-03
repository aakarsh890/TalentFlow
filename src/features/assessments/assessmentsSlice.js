// features/assessments/assessmentsSlice.js
import { create } from "zustand";


export const useAssessmentsStore = create((set) => ({
  assessments: [], // { id, jobId, title, sections: [ {id, title, questions: [...] } ] }
  responses: {},   // { assessmentId: { candidateId: answers } }

  addAssessment: (assessment) =>
    set((state) => ({ assessments: [...state.assessments, assessment] })),

  updateAssessment: (id, updated) =>
    set((state) => ({
      assessments: state.assessments.map((a) =>
        a.id === id ? { ...a, ...updated } : a
      ),
    })),

  saveResponse: (assessmentId, candidateId, answers) =>
    set((state) => ({
      responses: {
        ...state.responses,
        [assessmentId]: {
          ...(state.responses[assessmentId] || {}),
          [candidateId]: answers,
        },
      },
    })),
}));
