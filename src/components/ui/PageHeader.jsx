import { motion } from 'framer-motion';
import { clsx } from 'clsx';

/**
 * PageHeader — consistent dashboard heading.
 *  - title       (required)
 *  - subtitle    (optional)
 *  - icon        (Lucide component)
 *  - actions     (right-aligned ReactNode)
 *  - breadcrumbs (array of { label, href? })
 */
export default function PageHeader({
  title,
  subtitle,
  icon: Icon,
  actions,
  breadcrumbs,
  className = '',
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx('mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between', className)}
    >
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-light text-white shadow-md shadow-primary/20">
            <Icon className="h-6 w-6" />
          </div>
        )}
        <div>
          {breadcrumbs?.length > 0 && (
            <nav className="mb-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              {breadcrumbs.map((b, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <span className="opacity-50">/</span>}
                  {b.href ? (
                    <a href={b.href} className="hover:text-primary">{b.label}</a>
                  ) : (
                    <span>{b.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-balance">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-pretty">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </motion.header>
  );
}
