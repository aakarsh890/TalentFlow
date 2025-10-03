// JobsBoard.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchJobs, reorderJobs, toggleArchiveJob } from "./jobsSlice";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import DragDropList from "../../components/UI/DragDropList";
import Button from "../../components/UI/Button";
import LoadingSpinner from "../../components/LoadingSpinner";
import JobModal from "./JobModal";
import { Link } from "react-router-dom";

const JobsBoard = () => {
  const dispatch = useDispatch();
  const { list = [], status } = useSelector((state) => state.jobs || { list: [], status: "idle" });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const handleSearch = ({ query }) => {
    setQuery(query || "");
    setCurrentPage(1);
  };

  const filteredJobs = Array.isArray(list)
    ? list.filter((j) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          j.title?.toLowerCase().includes(q) ||
          (Array.isArray(j.tags) && j.tags.some((t) => t.toLowerCase().includes(q)))
        );
      })
    : [];

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / perPage));
  const paginated = filteredJobs.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleReorder = (newOrder) => {
    dispatch(reorderJobs(newOrder));
  };

  if (status === "loading") return <LoadingSpinner />;

  // helper for rendering tags as pills
  const renderTags = (tags) => {
    if (!Array.isArray(tags) || tags.length === 0) return null;
    return (
      <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {tags.map((t, i) => (
          <span
            key={`${t}-${i}`}
            style={{
              fontSize: 12,
              padding: "6px 10px",
              background: "rgba(255,255,255,0.03)",
              color: "#cfe8ff",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.03)",
              boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.2)",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0b1020, #0f1724)",
        padding: 32,
        color: "#e6eef8",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          borderRadius: 16,
          padding: 28,
          background: "rgba(255,255,255,0.02)",
          // removed outer border as requested
          border: "none",
          boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 22,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 800,
                margin: 0,
                color: "#f9fafb",
                letterSpacing: "-0.5px",
              }}
            >
              Jobs Management
            </h1>
            <p style={{ marginTop: 8, color: "#94a3b8", fontSize: 15 }}>
              Browse and manage job posts. 
            </p>
          </div>

          <Button
            onClick={() => {
              setSelectedJob(null);
              setModalOpen(true);
            }}
            style={{
              padding: "10px 16px",
              fontWeight: 700,
              fontSize: 14,
              borderRadius: 8,
              background: "linear-gradient(90deg,#3b82f6,#2563eb)",
              color: "#fff",
              boxShadow: "0 6px 18px rgba(38,99,235,0.16)",
            }}
          >
            + New Job
          </Button>
        </div>

        {/* Search + Reset */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 20,
            padding: 12,
            borderRadius: 12,
            background: "rgba(255,255,255,0.01)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.01)",
          }}
        >
          <div style={{ flex: 1 }}>
            <SearchBar query={query} onSearch={handleSearch} inputStyle={{ width: "100%" }} />
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              setQuery("");
              setCurrentPage(1);
            }}
            style={{
              padding: "8px 14px",
              fontSize: 14,
              minHeight: 40,
              alignSelf: "center",
            }}
          >
            Reset
          </Button>
        </div>

        {/* Job list */}
        <DragDropList
          items={paginated}
          onReorder={handleReorder}
          renderItem={(job) => (
            <div
              style={{
                background: "linear-gradient(180deg,#111827,#0b1220)",
                padding: 20,
                borderRadius: 12,
                marginBottom: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                boxShadow: "0 6px 14px rgba(0,0,0,0.45)",
                transition: "transform .12s ease, box-shadow .12s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.45)";
              }}
            >
              {/* Left: job info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#f1f5f9",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "80%",
                  }}
                  title={job.title}
                >
                  {job.title}
                </h3>

                <div style={{ marginTop: 8 }}>
                  <span style={{ fontSize: 14, color: "#9ca3af" }}>Status: </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: job.archived ? "#facc15" : "#4ade80",
                      marginLeft: 6,
                    }}
                  >
                    {job.archived ? "Archived" : "Active"}
                  </span>

                  {/* tags */}
                  {renderTags(job.tags)}
                </div>
              </div>

              {/* Right: actions */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  alignItems: "flex-end",
                  minWidth: 140,
                }}
              >
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelectedJob(job);
                    setModalOpen(true);
                  }}
                  style={{ width: "100%", background: "rgba(255,255,255,0.03)" }}
                >
                  Edit
                </Button>

                <Link to="/assessments" style={{ width: "100%" }}>
                  <Button
                    variant="secondary"
                    style={{
                      width: "100%",
                      background: "linear-gradient(180deg, rgba(100, 116, 139, 0.08), rgba(255,255,255,0.02))",
                    }}
                  >
                    Assessment
                  </Button>
                </Link>

                <Button
                  variant="secondary"
                  onClick={() => dispatch(toggleArchiveJob(job.id))}
                  style={{ width: "100%", background: "rgba(255,255,255,0.02)" }}
                >
                  {job.archived ? "Unarchive" : "Archive"}
                </Button>
              </div>
            </div>
          )}
        />

        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>

        {/* Job modal */}
        {modalOpen && (
          <JobModal
            job={selectedJob}
            onClose={() => {
              setModalOpen(false);
              setSelectedJob(null);
              dispatch(fetchJobs());
            }}
          />
        )}
      </div>
    </div>
  );
};

export default JobsBoard;
