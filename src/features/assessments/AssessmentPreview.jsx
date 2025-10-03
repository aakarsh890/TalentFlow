import React from "react";
import "./assessments.css";

export default function AssessmentPreview({ assessment }) {
  if (!assessment) return <p>No assessment selected</p>;
  return (
    <div className="preview">
      <h3>{assessment.title}</h3>
      {assessment.sections.map((sec) => (
        <div key={sec.id}>
          <h4>{sec.title}</h4>
          {sec.questions.map((q) => (
            <div key={q.id}>
              <label>{q.label}</label>
              {q.type === "short" && <input />}
              {q.type === "long" && <textarea />}
              {q.type === "numeric" && <input type="number" />}
              {/* For single/multi choice you'd render choices */}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
