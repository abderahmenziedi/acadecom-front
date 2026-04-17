import { getRoleColor } from '../../utils/roles';

export default function Badge({ children, variant, className = '' }) {
  const colors = {
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    role: '', // handled separately
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
        ${variant === 'role' ? getRoleColor(children) : colors[variant] || colors.info} ${className}`}
    >
      {children}
    </span>
  );
}
