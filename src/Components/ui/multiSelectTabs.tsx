interface MultiSelectTabsProps {
  label?: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

const MultiSelectTabs = ({
  label,
  options,
  value,
  onChange,
}: MultiSelectTabsProps) => {
  const toggleOption = (option: string) => {
    const updatedValue = value.includes(option)
      ? value.filter((item) => item !== option)
      : [...value, option];

    onChange(updatedValue);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-xs font-medium text-slate-600 text-left">
          {label}
        </label>
      )}

      <div className="flex flex-nowrap items-center gap-1.5">
        {options.map((option) => {
          const isSelected = value.includes(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              className={`whitespace-nowrap rounded-md border px-2.5 py-2 text-xs font-medium transition ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MultiSelectTabs;
