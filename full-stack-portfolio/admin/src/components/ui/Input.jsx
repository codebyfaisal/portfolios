import React from "react";

const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  name,
  className = "",
  children,
  icon,
  ...props
}) => {
  const id = React.useId
    ? React.useId()
    : `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-[0.9rem] font-medium text-muted-foreground"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          name={name}
          id={id}
          {...props}
          className={`w-full bg-input border border-primary/10 rounded-lg py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors placeholder-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed ${
            icon ? "pl-10 pr-4" : "px-4"
          }`}
        />
      </div>
      {children}
    </div>
  );
};

export default Input;
