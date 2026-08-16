import React from "react";

const Switch = ({ checked, onChange, className = "" }) => {
  return (
    <div
      className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${
        checked ? "bg-primary" : "bg-muted"
      } ${className}`}
      onClick={onChange}
    >
      <div
        className={`w-4 h-4 bg-background rounded-full shadow-sm transition-transform ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </div>
  );
};

export default Switch;
