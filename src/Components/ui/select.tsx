interface SelectProps {
  label?: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const Select = ({
  label,
  value,
  options,
  onChange,
}: SelectProps) => {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-slate-600 text-left">
          {label}
        </label>
      )}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;