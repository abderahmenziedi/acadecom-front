import { clsx } from 'clsx';

export default function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-[3px]', lg: 'h-12 w-12 border-4' };
  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <div className={clsx(sizes[size], 'animate-spin rounded-full border-gray-200 dark:border-gray-700 border-t-primary')} />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      <p className="text-sm text-gray-400 dark:text-gray-500">Chargement...</p>
    </div>
  );
}

export function Skeleton({ className = '' }) {
  return <div className={clsx('skeleton rounded-xl', className)} />;
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200/60 dark:border-gray-700/50 bg-white dark:bg-gray-800 p-6 space-y-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  );
}
