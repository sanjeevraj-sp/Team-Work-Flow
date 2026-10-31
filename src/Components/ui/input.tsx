interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

const Input = ({
  label,
  placeholder,
  value,
  onChange,
}: InputProps) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-xs font-medium text-slate-600 text-left">
          {label}
        </label>
      )}

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  );
};

export default Input;