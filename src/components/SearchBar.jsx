import React from "react";

const SearchBar = ({ query = "", onSearch }) => {
  const handleChange = (e) => {
    const q = e.target.value;
    onSearch({ query: q });
  };

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search..."
        style={{
          padding: "8px 12px",
          borderRadius: 6,
          border: "1px solid #3b4252",
          background: "#1f2933",
          color: "#fff",
          width: 260,
        }}
      />
      <button type="button" onClick={() => onSearch({ query })} style={{ padding: "8px 10px", borderRadius: 6 }}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
