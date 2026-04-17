import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const colorMap = {
  primary: {
    icon: 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light',
    trend: 'text-primary',
  },
  success: {
    icon: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
    trend: 'text-emerald-600',
  },
  warning: {
    icon: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
    trend: 'text-amber-600',
  },
  danger: {
    icon: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
    trend: 'text-red-600',
  },
  info: {
    icon: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400',
    trend: 'text-cyan-600',
  },
};

export default function StatsCard({ title, value, icon: Icon, color = 'primary', trend, delay = 0 }) {
  const c = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="group rounded-2xl border border-gray-200/60 dark:border-gray-700/50 bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value ?? '—'}</p>
          {trend !== undefined && (
            <p className={clsx('flex items-center gap-1 text-xs font-medium', trend >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400')}>
              <span>{trend >= 0 ? '↑' : '↓'}</span>
              {Math.abs(trend)}% vs dernier mois
            </p>
          )}
        </div>
        {Icon && (
          <div className={clsx('rounded-xl p-3 transition-transform duration-300 group-hover:scale-110', c.icon)}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
