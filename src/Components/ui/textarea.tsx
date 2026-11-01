
interface TextareaProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

const Textarea = ({
  label,
  placeholder,
  value,
  onChange,
  rows = 3,
}: TextareaProps) => {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      {label && (
        <label className="text-left text-xs font-medium text-slate-600">
          {label}
        </label>
      )}

      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full resize-none rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  );
};

export default Textarea;
