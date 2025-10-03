import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          style={{
            padding: "6px 10px",
            borderRadius: 6,
            background: currentPage === i + 1 ? "#2563eb" : "#374151",
            color: "#fff",
            border: "none",
          }}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
