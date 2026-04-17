import { clsx } from 'clsx';
import { forwardRef } from 'react';

const variants = {
  primary: 'bg-primary hover:bg-primary-dark text-white shadow-sm shadow-primary/25 hover:shadow-md hover:shadow-primary/30',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200',
  danger: 'bg-danger hover:bg-red-600 text-white shadow-sm shadow-danger/25',
  success: 'bg-success hover:bg-emerald-600 text-white shadow-sm shadow-success/25',
  outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
  ghost: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
  gradient: 'bg-gradient-to-r from-primary to-primary-light text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5',
};

const sizes = {
  xs: 'px-2.5 py-1 text-xs gap-1',
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-2.5 text-base gap-2',
  xl: 'px-8 py-3 text-base gap-2.5',
};

const Button = forwardRef(({
  children, variant = 'primary', size = 'md', className = '', disabled, loading, icon: Icon, iconRight: IconRight, ...props
}, ref) => (
  <button
    ref={ref}
    className={clsx(
      'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
      'dark:focus-visible:ring-offset-gray-900',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none',
      variants[variant],
      sizes[size],
      className,
    )}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? (
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
    ) : Icon ? (
      <Icon className="h-4 w-4 shrink-0" />
    ) : null}
    {children}
    {IconRight && !loading && <IconRight className="h-4 w-4 shrink-0" />}
  </button>
));

Button.displayName = 'Button';
export default Button;
