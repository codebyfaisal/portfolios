import { FaChevronDown } from "react-icons/fa";

const Select = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  className = "",
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-[0.9rem] font-medium text-muted-foreground">
          {label}
        </label>
      )}
      <div className="relative group">
        <select
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-input border border-primary/10 rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors placeholder-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer hover:border-primary/50"
          {...props}
        >
          <option
            value=""
            disabled
            className="bg-popover text-muted-foreground"
          >
            {placeholder}
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-popover text-foreground"
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground group-hover:text-foreground transition-colors">
          <FaChevronDown size={14} />
        </div>
      </div>
    </div>
  );
};

export default Select;
