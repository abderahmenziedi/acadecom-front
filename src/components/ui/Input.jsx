import { forwardRef } from 'react';
import { clsx } from 'clsx';

const Input = forwardRef(({ label, error, className = '', icon: Icon, ...props }, ref) => (
  <div className={className}>
    {label && (
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    )}
    <div className="relative">
      {Icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon className="h-4.5 w-4.5 text-gray-400 dark:text-gray-500" />
        </div>
      )}
      <input
        ref={ref}
        className={clsx(
          'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm transition-all duration-200',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          'dark:bg-gray-800 dark:text-gray-100',
          'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
          'dark:focus:ring-primary/40',
          error
            ? 'border-danger focus:ring-danger/30 focus:border-danger'
            : 'border-gray-300 dark:border-gray-600',
          Icon && 'pl-10',
        )}
        {...props}
      />
    </div>
    {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
  </div>
));

Input.displayName = 'Input';
export default Input;
