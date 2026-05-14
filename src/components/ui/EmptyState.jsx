import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-700/70 bg-white/40 dark:bg-gray-900/40 px-6 py-12 text-center backdrop-blur-sm',
        className,
      )}
    >
      {Icon && (
        <div className="mb-4 rounded-2xl bg-primary/10 p-4 text-primary">
          <Icon className="h-7 w-7" />
        </div>
      )}
      {title && (
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
      )}
      {description && (
        <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}
