import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

interface SelectProps {
  label?: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const Select = ({ label, value, options, onChange }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown on Escape.
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      {label && (
        <label className="text-left text-xs font-medium text-slate-600">
          {label}
        </label>
      )}

      <div className="relative" ref={dropdownRef}>
        {/* Dropdown Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen((previous) => !previous)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-left text-xs text-slate-700 outline-none transition hover:bg-slate-50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          <span className="truncate">{value}</span>

          <ChevronDown
            size={14}
            strokeWidth={1.7}
            className={`shrink-0 text-slate-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Options */}
        {isOpen && (
          <div
            role="listbox"
            className="absolute left-0 top-full z-20 mt-1.5 max-h-48 w-full min-w-40 overflow-y-auto rounded-lg border border-slate-200 bg-white px-1 shadow-lg"
          >
            {options.map((option) => {
              const isSelected = value === option;

              return (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option)}
                  className={`flex w-full items-center justify-between gap-2 rounded-md my-1 px-2 py-1.5 text-left text-xs transition ${
                    isSelected
                      ? "bg-indigo-50 font-medium text-indigo-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{option}</span>

                  {isSelected && (
                    <Check
                      size={13}
                      strokeWidth={2}
                      className="shrink-0 text-indigo-600"
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Select;