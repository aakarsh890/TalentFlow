import React, { useState } from "react";
import { useAssessmentsStore } from "./assessmentsSlice";
import { v4 as uuid } from "uuid";
import "./assessments.css";

export default function AssessmentBuilder({ jobId }) {
  const addAssessment = useAssessmentsStore((s) => s.addAssessment);
  const [title, setTitle] = useState("");
  const [sections, setSections] = useState([]);

  const addSection = () =>
    setSections([...sections, { id: uuid(), title: "New Section", questions: [] }]);

  const addQuestion = (sectionId) => {
    setSections((prev) =>
      prev.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              questions: [
                ...sec.questions,
                { id: uuid(), type: "short", label: "New Question" },
              ],
            }
          : sec
      )
    );
  };

  const saveAssessment = () => {
    if (!title.trim()) return alert("Title required");
    addAssessment({ id: uuid(), jobId, title, sections });
    setTitle("");
    setSections([]);
  };

  return (
    <div className="builder">
      <h2>Create Assessment</h2>
      <input
        placeholder="Assessment Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={addSection}>Add Section</button>
      {sections.map((sec) => (
        <div key={sec.id} className="section">
          <input
            value={sec.title}
            onChange={(e) =>
              setSections((prev) =>
                prev.map((s) =>
                  s.id === sec.id ? { ...s, title: e.target.value } : s
                )
              )
            }
          />
          <button onClick={() => addQuestion(sec.id)}>+ Question</button>
          {sec.questions.map((q) => (
            <div key={q.id} className="question">
              <input
                value={q.label}
                onChange={(e) =>
                  setSections((prev) =>
                    prev.map((s) =>
                      s.id === sec.id
                        ? {
                            ...s,
                            questions: s.questions.map((qq) =>
                              qq.id === q.id ? { ...qq, label: e.target.value } : qq
                            ),
                          }
                        : s
                    )
                  )
                }
              />
              <select
                value={q.type}
                onChange={(e) =>
                  setSections((prev) =>
                    prev.map((s) =>
                      s.id === sec.id
                        ? {
                            ...s,
                            questions: s.questions.map((qq) =>
                              qq.id === q.id ? { ...qq, type: e.target.value } : qq
                            ),
                          }
                        : s
                    )
                  )
                }
              >
                <option value="short">Short Text</option>
                <option value="long">Long Text</option>
                <option value="single">Single Choice</option>
                <option value="multi">Multi Choice</option>
                <option value="numeric">Numeric</option>
              </select>
            </div>
          ))}
        </div>
      ))}
      <button onClick={saveAssessment}>Save Assessment</button>
    </div>
  );
}
