// CandidatesList.jsx  (replace contents with this)
import React, { useEffect, useState, useMemo, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCandidates } from "./candidatesSlice";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Virtuoso } from "react-virtuoso";
import { Link, useNavigate } from "react-router-dom";
import CandidatesKanban from "./CandidatesKanban"; // expects to accept `embedded` prop

const CandidatesList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list = [], status } = useSelector((state) => state.candidates || { list: [], status: "idle" });
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("");

  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch]);

  const filtered = useMemo(() => {
    if (!Array.isArray(list)) return [];
    const q = (query || "").trim().toLowerCase();
    return list.filter((c) => {
      const name = (c.name || "").toLowerCase();
      const email = (c.email || "").toLowerCase();
      const matchesQuery = !q || name.includes(q) || email.includes(q);
      const matchesStage = !stageFilter || c.stage === stageFilter;
      return matchesQuery && matchesStage;
    });
  }, [list, query, stageFilter]);

  if (status === "loading") return <LoadingSpinner />;

  // stage order (fall back to unique stages in data)
  const preferred = ["Applied", "Phone Screen", "Interview", "Offer", "Hired", "Rejected"];
  const allStages = Array.from(new Set(list.map((c) => c.stage).filter(Boolean)));
  const stages = preferred.concat(allStages.filter((s) => !preferred.includes(s)));

  // List item sizing (used to compute overall height)
  const ITEM_SIZE = 96;

  // Inner wrapper (keeps same structure as before)
  const Inner = forwardRef(({ style, children, ...rest }, ref) => {
    const merged = { ...style, boxSizing: "border-box", width: "100%", padding: "6px 0" };
    return (
      <div ref={ref} style={merged} {...rest}>
        {children}
      </div>
    );
  });

  const Row = ({ index, style = {} }) => {
    const candidate = filtered[index];
    if (!candidate) return null;
    const rowStyle = { ...style, width: "100%", left: 0, right: 0, boxSizing: "border-box" };
    const avatarLetter = (candidate.name || candidate.email || "C")[0].toUpperCase();

    return (
      <div style={rowStyle}>
        <div
          className="px-2"
          style={{
            width: "100%",
            boxSizing: "border-box",
            paddingLeft: 8,
            paddingRight: 8,
          }}
        >
          <Link
            to={`/candidates/${candidate.id}`}
            className="block"
            aria-label={`Open ${candidate.name || candidate.email}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                padding: 14,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.04)",
                background: "linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.00))",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "center", minWidth: 0 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#0f1724",
                    color: "#9fbefc",
                    fontWeight: 700,
                    border: "1px solid rgba(255,255,255,0.04)",
                    flexShrink: 0,
                  }}
                >
                  {avatarLetter}
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#f8fafc",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "55ch",
                      }}
                    >
                      {candidate.name || `${candidate.firstName || ""} ${candidate.lastName || ""}`}
                    </div>

                    <div
                      style={{
                        padding: "4px 8px",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 700,
                        background: candidate.stage === "Hired" ? "rgba(45,163,87,0.12)" : "rgba(255,255,255,0.03)",
                        color: candidate.stage === "Hired" ? "#9be7a3" : "#cbd5e1",
                        border: "1px solid rgba(255,255,255,0.03)",
                        flexShrink: 0,
                      }}
                    >
                      {candidate.stage || "—"}
                    </div>
                  </div>

                  <div style={{ fontSize: 13, color: "#cbd5e1", marginTop: 6, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {candidate.email}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/candidates/${candidate.id}`);
                  }}
                  style={{ color: "#60a5fa", fontWeight: 700, cursor: "pointer", fontSize: 14 }}
                >
                  View
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/candidates/${candidate.id}/edit`);
                  }}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.04)",
                    background: "rgba(255,255,255,0.02)",
                    color: "#e6eef8",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          </Link>
        </div>
      </div>
    );
  };

  // compute list height (avoid it reaching top of page)
  const LIST_HEIGHT = Math.min(720, Math.max(300, (filtered.length || 1) * Math.min(ITEM_SIZE, 120)));

  return (
    <div style={{ minHeight: "100vh", background: "#0b1020", color: "#e6eef8", padding: 24, boxSizing: "border-box" }}>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: 20,
          borderRadius: 12,
          background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
          border: "1px solid rgba(255,255,255,0.03)",
          boxSizing: "border-box",
        }}
      >
        {/* List header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 14 }}>
          <div style={{ minWidth: 0 }}>
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#f8fafc", lineHeight: 1.05 }}>Candidates</h2>
            <p style={{ marginTop: 8, color: "#94a3b8" }}>
              Browse and manage candidates—
            </p>
          </div>

          <div style={{ color: "#7dd3fc", fontWeight: 700, alignSelf: "flex-start" }}>
            Total: <span style={{ color: "#fff", fontWeight: 800 }}>{list.length}</span>
          </div>
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "flex-end",
            borderRadius: 10,
            padding: 14,
            marginBottom: 12,
            background: "linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.00))",
            border: "1px solid rgba(255,255,255,0.03)",
            position: "relative",
            zIndex: 20,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <label style={{ display: "block", fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>Search</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email..."
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.03)",
                background: "#0f1724",
                color: "#e6eef8",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ width: 220, minWidth: 160 }}>
            <label style={{ display: "block", fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>Stage</label>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.03)",
                background: "#0f1724",
                color: "#e6eef8",
                boxSizing: "border-box",
              }}
            >
              <option value="">All stages</option>
              {stages.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              onClick={() => {
                setQuery("");
                setStageFilter("");
              }}
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: "linear-gradient(180deg,#2563eb,#1d4ed8)",
                color: "#fff",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* List container */}
        <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.03)", background: "transparent", padding: 0 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 20, color: "#94a3b8" }}>No candidates found.</div>
          ) : (
            <div style={{ height: LIST_HEIGHT }}>
              <Virtuoso
                style={{ height: "100%" }}
                totalCount={filtered.length}
                itemContent={(index) => <Row index={index} />}
                components={{ Scroller: Inner }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidatesList;
