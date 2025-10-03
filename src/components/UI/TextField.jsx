import React from "react";

const TextField = ({ label, value, onChange, placeholder }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ color: "#cbd5e1" }}>{label}</label>}
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #334155", background: "#0b1220", color: "#fff" }}
      />
    </div>
  );
};

export default TextField;
