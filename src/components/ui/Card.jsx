import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = false, glass = false, ...props }) {
  const Comp = hover ? motion.div : 'div';
  const motionProps = hover ? {
    whileHover: { y: -2, boxShadow: '0 12px 24px -4px rgba(0,0,0,0.08)' },
    transition: { duration: 0.2 },
  } : {};

  return (
    <Comp
      className={clsx(
        'rounded-2xl border p-6 transition-all duration-200',
        glass
          ? 'glass-card'
          : 'bg-white dark:bg-gray-800 border-gray-200/60 dark:border-gray-700/50 shadow-sm',
        className,
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={clsx('mb-5', className)}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={clsx('text-lg font-semibold text-gray-900 dark:text-white', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={clsx('mt-1 text-sm text-gray-500 dark:text-gray-400', className)}>
      {children}
    </p>
  );
}
