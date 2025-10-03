import React from "react";

const LoadingSpinner = ({ size = "40px" }) => (
  <div className="flex justify-center items-center py-4">
    <div
      className="border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
      style={{ width: size, height: size }}
    />
  </div>
);

export default LoadingSpinner;
