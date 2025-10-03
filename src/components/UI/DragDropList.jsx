import React from "react";

const DragDropList = ({ items = [], renderItem }) => {
  return <div style={{ display: "grid", gap: 12 }}>{items.map((it) => <div key={it.id}>{renderItem(it)}</div>)}</div>;
};

export default DragDropList;
