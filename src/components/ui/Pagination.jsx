import { clsx } from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination
 * ----------
 * Minimal but accessible pagination with first/last shortcuts.
 *
 *  - page         (number, 1-indexed)
 *  - totalPages   (number)
 *  - onPageChange (fn)
 */
export default function Pagination({ page, totalPages, onPageChange, className = '' }) {
  if (!totalPages || totalPages <= 1) return null;

  const goto = (p) => onPageChange?.(Math.max(1, Math.min(totalPages, p)));

  // Build visible page range
  const pages = [];
  const start = Math.max(1, page - 1);
  const end = Math.min(totalPages, page + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav
      className={clsx('mt-6 flex items-center justify-center gap-1.5 text-sm select-none', className)}
      aria-label="Pagination"
    >
      <button
        onClick={() => goto(page - 1)}
        disabled={page <= 1}
        className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Page précédente"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {start > 1 && (
        <>
          <PageButton n={1} active={page === 1} onClick={goto} />
          {start > 2 && <span className="px-1 text-gray-400">…</span>}
        </>
      )}
      {pages.map((p) => (
        <PageButton key={p} n={p} active={p === page} onClick={goto} />
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-gray-400">…</span>}
          <PageButton n={totalPages} active={page === totalPages} onClick={goto} />
        </>
      )}

      <button
        onClick={() => goto(page + 1)}
        disabled={page >= totalPages}
        className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Page suivante"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

function PageButton({ n, active, onClick }) {
  return (
    <button
      onClick={() => onClick(n)}
      className={clsx(
        'min-w-[2.25rem] rounded-xl px-3 py-1.5 font-medium transition-colors',
        active
          ? 'bg-primary text-white shadow-sm shadow-primary/30'
          : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
      )}
    >
      {n}
    </button>
  );
}
