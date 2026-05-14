import { clsx } from 'clsx';

export default function Skeleton({ className = '' }) {
  return <div className={clsx('skeleton', className)} />;
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={clsx('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={clsx('h-3', i === lines - 1 ? 'w-2/3' : 'w-full')}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-gray-200/60 dark:border-gray-700/50 bg-white dark:bg-gray-800 p-6 shadow-sm',
        className,
      )}
    >
      <Skeleton className="h-5 w-1/3 mb-4" />
      <SkeletonText lines={4} />
    </div>
  );
}

export function SkeletonTableRow({ cols = 4 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full max-w-[180px]" />
        </td>
      ))}
    </tr>
  );
}
