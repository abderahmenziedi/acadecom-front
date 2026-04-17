import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div className={className}>
    {label && (
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
    )}
    <input
      ref={ref}
      className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors
        focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
        ${error ? 'border-danger' : 'border-gray-300'}`}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-danger">{error}</p>}
  </div>
));

Input.displayName = 'Input';
export default Input;
