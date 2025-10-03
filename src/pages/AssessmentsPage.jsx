import React, { useState } from "react";
import AssessmentBuilder from "../features/assessments/AssessmentBuilder";
import AssessmentPreview from "../features/assessments/AssessmentPreview";
import AssessmentForm from "../features/assessments/AssessmentForm";
import { useAssessmentsStore } from "../features/assessments/assessmentsSlice";

const btnBase = {
  padding: "8px 12px",
  borderRadius: 8,
  fontWeight: 700,
  cursor: "pointer",
  border: "1px solid rgba(255,255,255,0.04)",
  background: "rgba(255,255,255,0.02)",
  color: "#e6eef8",
};

const btnActive = {
  background: "linear-gradient(90deg,#34d399,#10b981)",
  color: "#052e16",
  border: "none",
};

const disabledStyle = {
  opacity: 0.5,
  cursor: "not-allowed",
};

export default function AssessmentsPage({ candidateId }) {
  const assessments = useAssessmentsStore((s) => s.assessments);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [mode, setMode] = useState("builder"); 

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#07101a,#0b1220)",
        color: "#e6eef8",
        padding: 28,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          borderRadius: 12,
          padding: 24,
          background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
          boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
          border: "1px solid rgba(255,255,255,0.03)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#f8fafc" }}>Assessments Management</h1>
            <p style={{ marginTop: 8, color: "#94a3b8" }}>
              Create, preview, and run assessments for candidates.
            </p>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => { setMode("builder"); }}
              style={{ ...btnBase, ...(mode === "builder" ? btnActive : {}) }}
            >
              Builder
            </button>
            <button
              onClick={() => { setMode("preview"); }}
              disabled={!selectedAssessment}
              style={{
                ...btnBase,
                ...(mode === "preview" ? btnActive : {}),
                ...( !selectedAssessment ? disabledStyle : {}),
              }}
            >
              Preview
            </button>
            <button
              onClick={() => { setMode("form"); }}
              disabled={!selectedAssessment}
              style={{
                ...btnBase,
                ...(mode === "form" ? btnActive : {}),
                ...( !selectedAssessment ? disabledStyle : {}),
              }}
            >
              Form
            </button>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          {/* builder / preview / form area */}
          <div
            style={{
              borderRadius: 12,
              padding: 18,
              background: "linear-gradient(180deg,#0f1724,#0b1220)",
              border: "1px solid rgba(255,255,255,0.03)",
              boxShadow: "0 6px 18px rgba(2,6,23,0.5)",
            }}
          >
            {mode === "builder" && <AssessmentBuilder jobId="job1" />}
            {mode === "preview" && <AssessmentPreview assessment={selectedAssessment} />}
            {mode === "form" && (
              <AssessmentForm assessmentId={selectedAssessment?.id} candidateId={candidateId} />
            )}
          </div>

          {/* existing assessments */}
          <div style={{ marginTop: 20 }}>
            <h2 style={{ margin: "6px 0 12px 0", fontSize: 20, fontWeight: 700, color: "#f8fafc" }}>
              Existing Assessments
            </h2>

            {assessments.length === 0 ? (
              <div style={{ color: "#94a3b8" }}>No assessments yet. Use the Builder to create a new one.</div>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {assessments.map((a) => (
                  <li key={a.id}>
                    <button
                      onClick={() => {
                        setSelectedAssessment(a);
                        // optionally switch to preview when selecting
                        setMode("preview");
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 12px",
                        borderRadius: 10,
                        background: selectedAssessment?.id === a.id ? "linear-gradient(90deg,#34d399,#10b981)" : "rgba(255,255,255,0.02)",
                        color: selectedAssessment?.id === a.id ? "#052e16" : "#e6eef8",
                        border: "1px solid rgba(255,255,255,0.03)",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      {a.title}
                      <span style={{ marginLeft: 8, fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>
                        {a.sections?.length ? `${a.sections.length} sections` : "0 sections"}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
