import { create } from "zustand";


export const useAssessmentsStore = create((set) => ({
  assessments: [], 
  responses: {},   

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
