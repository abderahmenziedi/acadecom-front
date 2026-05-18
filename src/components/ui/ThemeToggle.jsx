import { Moon, Sun } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../../context/ThemeContext';

/** Sun when viewing dark UI (switch to light); moon when viewing light UI (switch to dark). */
export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();
  const Icon = isDark ? Sun : Moon;
  const label = isDark ? 'Passer au mode clair' : 'Passer au mode sombre';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={clsx('ds-icon-btn', className)}
      title={label}
      aria-label={label}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
    </button>
  );
}
