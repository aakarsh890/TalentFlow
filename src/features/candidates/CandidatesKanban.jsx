import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCandidates, updateCandidateStage } from "./candidatesSlice";
import LoadingSpinner from "../../components/LoadingSpinner";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";

// Stages in fixed order
const stages = ["Applied", "Phone Screen", "Interview", "Offer", "Hired", "Rejected"];

const CandidatesKanban = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list = [], status } = useSelector((s) => s.candidates || { list: [], status: "idle" });

  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch]);

  // Group candidates by stage
  const grouped = stages.reduce((acc, stage) => {
    acc[stage] = Array.isArray(list) ? list.filter((c) => c.stage === stage) : [];
    return acc;
  }, {});

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const candidate = grouped[source.droppableId]?.[source.index];
    if (!candidate) return;

    dispatch(updateCandidateStage({ id: candidate.id, stage: destination.droppableId }));
  };

  if (status === "loading") return <LoadingSpinner />;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b1020",
        padding: 28,
        boxSizing: "border-box",
        color: "#e6eef8",
      }}
    >
      {/* Main Kanban Panel */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          borderRadius: 12,
          padding: 22,
          background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
          border: "1px solid rgba(255,255,255,0.03)",
          boxSizing: "border-box",
        }}
      >
        {/* Panel header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#fff" }}>
              Candidates Kanban
            </h2>
            {/* stuff */}
            <p style={{ marginTop: 8, marginBottom: 0, color: "#94a3b8" }}>
              
            </p>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => navigate("/candidates")}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.02)",
                color: "#e6eef8",
                border: "1px solid rgba(255,255,255,0.03)",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              + New Candidate
            </button>
          </div>
        </div>

        {/* Kanban Columns */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 12 }}>
            {stages.map((stage) => (
              <Droppable key={stage} droppableId={stage}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      minWidth: 260,
                      maxWidth: 260,
                      borderRadius: 10,
                      padding: 12,
                      background: snapshot.isDraggingOver
                        ? "rgba(37,99,235,0.06)"
                        : "rgba(255,255,255,0.01)",
                      border: "1px solid rgba(255,255,255,0.03)",
                      display: "flex",
                      flexDirection: "column",
                      height: "72vh",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 12,
                      }}
                    >
                      <div style={{ fontWeight: 700, color: "#f8fafc" }}>{stage}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>
                        {grouped[stage]?.length ?? 0}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        overflowY: "auto",
                        paddingRight: 6,
                      }}
                    >
                      {grouped[stage]?.map((c, idx) => (
                        <Draggable key={String(c.id)} draggableId={String(c.id)} index={idx}>
                          {(prov, snap) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              style={{
                                ...prov.draggableProps.style,
                                userSelect: "none",
                                background: snap.isDragging
                                  ? "rgba(255,255,255,0.02)"
                                  : "#111827",
                                borderRadius: 10,
                                padding: 12,
                                border: "1px solid rgba(255,255,255,0.03)",
                                boxShadow: snap.isDragging
                                  ? "0 10px 30px rgba(0,0,0,0.5)"
                                  : "0 6px 16px rgba(2,6,23,0.6)",
                                color: "#e6eef8",
                                display: "flex",
                                flexDirection: "column",
                                gap: 6,
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div
                                  style={{
                                    fontWeight: 700,
                                    color: "#f8fafc",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {c.name}
                                </div>
                              </div>

                              <div style={{ fontSize: 13, color: "#94a3b8" }}>{c.email}</div>

                              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/candidates/${c.id}`);
                                  }}
                                  style={{
                                    padding: "6px 10px",
                                    borderRadius: 8,
                                    background: "rgba(255,255,255,0.02)",
                                    border: "1px solid rgba(255,255,255,0.03)",
                                    color: "#60a5fa",
                                    cursor: "pointer",
                                    fontWeight: 700,
                                  }}
                                >
                                  View
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/candidates/${c.id}/edit`);
                                  }}
                                  style={{
                                    padding: "6px 10px",
                                    borderRadius: 8,
                                    background: "rgba(255,255,255,0.02)",
                                    border: "1px solid rgba(255,255,255,0.03)",
                                    color: "#e6eef8",
                                    cursor: "pointer",
                                    fontWeight: 700,
                                  }}
                                >
                                  Edit
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default CandidatesKanban;
