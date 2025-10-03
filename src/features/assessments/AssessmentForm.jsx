import React, { useState } from "react";
import { useAssessmentsStore } from "./assessmentsSlice";
import "./assessments.css";

export default function AssessmentForm({ assessmentId, candidateId }) {
  const { assessments, saveResponse } = useAssessmentsStore();
  const assessment = assessments.find((a) => a.id === assessmentId);
  const [answers, setAnswers] = useState({});

  if (!assessment) return <p>Assessment not found</p>;

  const handleChange = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const handleSubmit = () => {
    // simple required validation
    for (const sec of assessment.sections) {
      for (const q of sec.questions) {
        if (!answers[q.id]) return alert(`Please answer: ${q.label}`);
      }
    }
    saveResponse(assessmentId, candidateId, answers);
    alert("Responses submitted!");
  };

  return (
    <div className="assessment-form">
      <h3>{assessment.title}</h3>
      {assessment.sections.map((sec) => (
        <div key={sec.id}>
          <h4>{sec.title}</h4>
          {sec.questions.map((q) => (
            <div key={q.id}>
              <label>{q.label}</label>
              {q.type === "short" && (
                <input
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
              )}
              {q.type === "long" && (
                <textarea
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
              )}
              {q.type === "numeric" && (
                <input
                  type="number"
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
