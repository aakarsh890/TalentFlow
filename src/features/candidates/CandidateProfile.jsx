// CandidateProfile.jsx  (replace file contents with this)
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCandidate } from "../../api/candidatesApi";
import LoadingSpinner from "../../components/LoadingSpinner";
import Button from "../../components/UI/Button";
import TextField from "../../components/UI/TextField";
import { useDispatch } from "react-redux";
import { addCandidateNote } from "./candidatesSlice";

const CandidateProfile = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getCandidate(id);
        const data = res?.data ?? res;
        if (mounted) setCandidate(data);
      } catch (err) {
        console.error("Failed to load candidate:", err);
        if (mounted) setError("Failed to load candidate");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleAddNote = async () => {
    if (!note.trim()) return;
    try {
      const action = await dispatch(addCandidateNote({ id, note }));
      if (action.error) {
        console.error("addCandidateNote failed:", action.error);
        setCandidate((prev) => ({
          ...prev,
          notes: [...(prev?.notes || []), { text: note, createdAt: new Date().toISOString() }],
        }));
      } else {
        const payload = action.payload;
        const updatedCandidate = payload?.data ?? payload;
        if (updatedCandidate && updatedCandidate.id) {
          setCandidate(updatedCandidate);
        } else {
          setCandidate((prev) => ({
            ...prev,
            notes: [...(prev?.notes || []), { text: note, createdAt: new Date().toISOString() }],
          }));
        }
      }
      setNote("");
    } catch (err) {
      console.error("Error adding note:", err);
      setCandidate((prev) => ({
        ...prev,
        notes: [...(prev?.notes || []), { text: note, createdAt: new Date().toISOString() }],
      }));
      setNote("");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p style={{ padding: 16, color: "#f87171" }}>{error}</p>;
  if (!candidate) return <p style={{ padding: 16, color: "#94a3b8" }}>Candidate not found.</p>;

  // helpers
  const renderTimelineEntry = (t, idx) => {
    if (!t) return null;
    const key = t.id ?? `t-${idx}`;
    const when = t.createdAt ? new Date(t.createdAt).toLocaleString() : null;
    if (t.type === "stage_change") {
      return (
        <li key={key} style={{ marginBottom: 8 }}>
          <strong style={{ color: "#e6eef8" }}>{t.from}</strong>
          <span style={{ color: "#94a3b8", margin: "0 8px" }}>→</span>
          <strong style={{ color: "#e6eef8" }}>{t.to}</strong>
          {when && <span style={{ marginLeft: 8, color: "#94a3b8", fontSize: 12 }}>({when})</span>}
          {t.note && <div style={{ color: "#cbd5e1", marginTop: 6 }}>{t.note}</div>}
        </li>
      );
    }
    return (
      <li key={key} style={{ marginBottom: 8, color: "#cbd5e1" }}>
        {t.note ?? JSON.stringify(t)}
        {when && <span style={{ marginLeft: 8, color: "#94a3b8", fontSize: 12 }}>({when})</span>}
      </li>
    );
  };

  const formatNoteItem = (n) => {
    if (!n) return { text: "", when: "" };
    if (typeof n === "string") return { text: n, when: "" };
    return { text: n.text ?? JSON.stringify(n), when: n.createdAt ? new Date(n.createdAt).toLocaleString() : "" };
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b1020",
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
          padding: 22,
          background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
          border: "1px solid rgba(255,255,255,0.03)",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 8 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#ffffff" }}>
            {candidate.name ?? `${candidate.firstName ?? ""} ${candidate.lastName ?? ""}`}
          </h1>
          <p style={{ margin: "8px 0 0 0", color: "#94a3b8" }}>{candidate.email}</p>
          <p style={{ margin: "6px 0 0 0", color: "#9ca3af" }}>
            Current Stage: <span style={{ color: "#e6eef8", fontWeight: 700 }}>{candidate.stage ?? "—"}</span>
          </p>
        </div>

        {/* Timeline */}
        <div style={{ marginTop: 18 }}>
          <h3 style={{ color: "#f8fafc", marginBottom: 12 }}>Timeline</h3>
          <ul style={{ listStyle: "disc", paddingLeft: 20, marginTop: 8 }}>
            {Array.isArray(candidate.timeline) && candidate.timeline.length > 0 ? (
              candidate.timeline.map((t, idx) => renderTimelineEntry(t, idx))
            ) : (
              <li style={{ color: "#94a3b8" }}>No updates yet.</li>
            )}
          </ul>
        </div>

        {/* Notes */}
        <div style={{ marginTop: 22 }}>
          <h3 style={{ color: "#f8fafc", marginBottom: 12 }}>Notes</h3>

          <ul style={{ listStyle: "disc", paddingLeft: 20, marginTop: 8 }}>
            {Array.isArray(candidate.notes) && candidate.notes.length > 0 ? (
              candidate.notes.map((n, idx) => {
                const key = (n && n.id) ?? `n-${idx}`;
                const { text, when } = formatNoteItem(n);
                return (
                  <li key={key} style={{ marginBottom: 10 }}>
                    <div style={{ color: "#e6eef8" }}>{text}</div>
                    {when && <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>{when}</div>}
                  </li>
                );
              })
            ) : (
              <li style={{ color: "#94a3b8" }}>No notes yet.</li>
            )}
          </ul>

          {/* Add note */}
          <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
            {/* TextField should accept className; pass style to ensure full width */}
            <TextField
              placeholder="Add note with @mentions..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{
                flex: 1,
                background: "#0f1724",
                color: "#e6eef8",
                border: "1px solid rgba(255,255,255,0.03)",
                borderRadius: 8,
                padding: "10px 12px",
                boxSizing: "border-box",
              }}
            />
            <Button
              onClick={handleAddNote}
              style={{
                padding: "8px 14px",
                background: "linear-gradient(180deg,#2563eb,#1d4ed8)",
                color: "#fff",
                fontWeight: 700,
                borderRadius: 8,
              }}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
