import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-300">
          {label}
          {props.required && <span className="text-teal-400 ml-1">*</span>}
        </label>
      )}
      <select
        className={`w-full glass border ${error ? 'border-red-400/60' : 'border-white/10'} rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-teal-400/60 transition-colors bg-[#0a1128] ${className}`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-[#0a1128]">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
