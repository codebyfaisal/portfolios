import React, { forwardRef, useState, useRef, useEffect, useId } from "react";
import { cn } from "@/utils/cn";
import usePortfolioStore from "@/store/usePortfolioStore";
import { FaChevronDown } from "react-icons/fa";

const Select = forwardRef(
  (
    {
      className,
      wrapperClassName,
      label,
      error,
      options = [],
      placeholder = "Select an option",
      onChange,
      value,
      ...props
    },
    ref,
  ) => {
    const { isRounded } = usePortfolioStore();
    const id = useId();
    const inputId = props.id || id;
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(value || "");
    const containerRef = useRef(null);
    const innerSelectRef = useRef(null);

    const normalizedOptions = options.map((opt) => {
      if (typeof opt === "string") return { label: opt, value: opt };
      const val = opt.value || opt.type || opt.label;
      const lbl = opt.label || opt.type || opt.value;
      return { ...opt, label: lbl, value: val };
    });

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
      if (value !== undefined) setSelected(value);
    }, [value]);

    const handleSelect = (optionValue) => {
      setSelected(optionValue);
      setIsOpen(false);

      if (innerSelectRef.current) {
        innerSelectRef.current.value = optionValue;
        const event = new Event("change", { bubbles: true });
        innerSelectRef.current.dispatchEvent(event);
      }

      if (onChange) {
        const event = {
          target: {
            value: optionValue,
            name: props.name,
          },
          type: "change",
        };
        onChange(event);
      }
    };

    const selectedLabel =
      normalizedOptions.find((opt) => opt.value === selected)?.label ||
      placeholder;

    return (
      <div
        className={cn("space-y-2 w-full", wrapperClassName)}
        ref={containerRef}
      >
        {label && (
          <label
            htmlFor={inputId}
            className="text-[0.9rem] font-medium text-muted-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {/* Hidden native select for form data capture & forwardRef */}
          <select
            {...props}
            ref={(e) => {
              innerSelectRef.current = e;
              if (typeof ref === "function") ref(e);
              else if (ref) ref.current = e;
            }}
            className="sr-only"
            value={selected}
            onChange={(e) => {
              setSelected(e.target.value);
              if (onChange) onChange(e);
            }}
            id={inputId}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {normalizedOptions.map((opt, idx) => (
              <option key={idx} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Custom Trigger */}
          <div
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "w-full bg-card border border-border px-4 py-2.5 text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer flex justify-between items-center",
              error && "border-red-500",
              isRounded && "rounded-2xl",
              isOpen && "border-primary",
              className,
            )}
          >
            <span
              className={cn(!selected && "text-muted-foreground", "capitalize")}
            >
              {selectedLabel}
            </span>
            <FaChevronDown
              className={cn(
                "w-3 h-3 text-muted-foreground transition-transform duration-200",
                isOpen && "rotate-180",
              )}
            />
          </div>

          {/* Dropdown Menu */}
          {isOpen && (
            <div
              className={cn(
                "absolute top-full mt-2 w-full bg-card border border-border z-50 shadow-lg overflow-hidden",
                isRounded && "rounded-2xl",
              )}
            >
              <div className="max-h-60 overflow-y-auto py-">
                {normalizedOptions.map((opt, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (opt.disabled) return;
                      handleSelect(opt.value);
                    }}
                    className={cn(
                      "px-4 py-2.5 text-sm cursor-pointer transition-colors capitalize",
                      selected === opt.value
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-input/70",
                      opt.disabled &&
                        "opacity-50 cursor-not-allowed hover:bg-transparent",
                    )}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {error && typeof error === "string" && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
export default Select;
