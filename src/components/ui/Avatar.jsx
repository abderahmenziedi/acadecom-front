import { clsx } from 'clsx';
import { assetUrl } from '../../api/axios';
import { initials } from '../../utils/formatters';

const SIZES = {
  xs: 'h-7 w-7 text-[10px]',
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-lg',
  '2xl': 'h-28 w-28 text-2xl',
};

export default function Avatar({ src, name, size = 'md', className = '', ring = false }) {
  const url = src ? assetUrl(src) : null;
  return (
    <div
      className={clsx(
        'inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-light font-bold text-white shadow-sm shadow-primary/20',
        ring && 'ring-2 ring-white dark:ring-gray-900',
        SIZES[size] || SIZES.md,
        className,
      )}
    >
      {url ? (
        <img src={url} alt={name || 'avatar'} className="h-full w-full object-cover" />
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  );
}
