import { clsx } from 'clsx';
import { forwardRef } from 'react';

const Select = forwardRef(({ label, error, options = [], className = '', ...props }, ref) => (
  <div className={className}>
    {label && (
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    )}
    <select
      ref={ref}
      className={clsx(
        'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm transition-all duration-200 appearance-none',
        'dark:bg-gray-800 dark:text-gray-100',
        'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
        error ? 'border-danger' : 'border-gray-300 dark:border-gray-600',
      )}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
  </div>
));

Select.displayName = 'Select';
export default Select;
