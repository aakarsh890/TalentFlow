// CandidatesPage.jsx
import React, { useState } from "react";
import CandidatesList from "../features/candidates/CandidatesList";
import CandidatesKanban from "../features/candidates/CandidatesKanban";

const CandidatesPage = () => {
  const [view, setView] = useState("list"); // "list" | "kanban"

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b1020",
        color: "#e6eef8",
        padding: 24,
        boxSizing: "border-box",
      }}
    >
      {/* Header + toggle buttons */}
      <div style={{ maxWidth: 1100, margin: "0 auto 18px", textAlign: "center" }}>
        <h1
          style={{
            fontSize: 34,
            fontWeight: 800,
            color: "#f8fafc",
            margin: "6px 0",
          }}
        >
          Candidates Management
        </h1>

        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 12 }}>
          <button
            onClick={() => setView("list")}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background:
                view === "list"
                  ? "linear-gradient(180deg,#34d399,#10b981)"
                  : "rgba(255,255,255,0.02)",
              color: view === "list" ? "#052e16" : "#e6eef8",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
            }}
          >
            List View
          </button>

          <button
            onClick={() => setView("kanban")}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background:
                view === "kanban"
                  ? "linear-gradient(180deg,#34d399,#10b981)"
                  : "rgba(255,255,255,0.02)",
              color: view === "kanban" ? "#052e16" : "#e6eef8",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
            }}
          >
            Kanban View
          </button>
        </div>
      </div>

      {/* Candidates content (list or kanban) */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
          
        }}
      >
        {view === "list" ? <CandidatesList /> : <CandidatesKanban embedded={true} />}
      </div>
    </div>
  );
};

export default CandidatesPage;
