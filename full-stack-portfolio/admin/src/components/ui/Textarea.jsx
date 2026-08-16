import React from "react";

const Textarea = ({
  label,
  value,
  onChange,
  placeholder,
  required,
  name,
  rows = 3,
  className = "",
  disabled = false,
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-[0.9rem] font-medium text-muted-foreground">
          {label}
        </label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        disabled={disabled}
        className="w-full bg-input border border-primary/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors text-foreground placeholder-muted-foreground resize-none"
      />
    </div>
  );
};

export default Textarea;
