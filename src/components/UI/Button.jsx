import React from "react";

const Button = ({ children, variant, onClick, style }) => {
  const base = {
    padding: "8px 12px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  };

  const variants = {
    primary: { background: "#2563eb", color: "#fff" },
    secondary: { background: "#374151", color: "#fff" },
  };

  return (
    <button onClick={onClick} style={{ ...base, ...(variants[variant] || variants.primary), ...(style || {}) }}>
      {children}
    </button>
  );
};

export default Button;
