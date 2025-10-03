import React from "react";

const Modal = ({ children, onClose }) => {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#0b1220", color: "#fff", padding: 20, borderRadius: 8, minWidth: 360 }}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
