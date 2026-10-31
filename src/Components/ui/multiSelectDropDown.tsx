interface MultiSelectDropdownProps {
  label: string;
  placeholder?: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

const MultiSelectDropdown = ({
  label,
  placeholder = "Select options",
  options,
  value,
  onChange,
}: MultiSelectDropdownProps) => {
  const toggleOption = (option: string) => {
    const updatedValue = value.includes(option)
      ? value.filter((item) => item !== option)
      : [...value, option];

    onChange(updatedValue);
  };

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-600 text-left">
        {label}
      </label>

      <details className="group relative">
        <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-700 transition hover:border-slate-400">
          <span className="truncate">
            {value.length > 0
              ? `${value.length} selected`
              : placeholder}
          </span>

          <span className="ml-2 shrink-0 text-slate-400 transition-transform group-open:rotate-180">
            ▼
          </span>
        </summary>

        <div className="absolute left-0 top-full z-20 mt-1.5 max-h-48 w-full min-w-40 overflow-y-auto rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg">
          {options.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
            >
              <input
                type="checkbox"
                checked={value.includes(option)}
                onChange={() => toggleOption(option)}
                className="size-3.5 accent-indigo-600"
              />

              {option}
            </label>
          ))}
        </div>
      </details>
    </div>
  );
};

export default MultiSelectDropdown;