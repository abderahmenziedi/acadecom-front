import { clsx } from 'clsx';
import { Check } from 'lucide-react';

export default function Stepper({ steps, current = 0, className = '' }) {
  return (
    <ol className={clsx('flex items-center', className)}>
      {steps.map((step, idx) => {
        const status = idx < current ? 'done' : idx === current ? 'active' : 'idle';
        const last = idx === steps.length - 1;

        return (
          <li key={step.id} className={clsx('flex items-center', !last && 'flex-1')}>
            <div className="relative flex flex-col items-center">
              <span className={clsx(
                'inline-flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold transition-all',
                status === 'done' ? 'border-primary bg-primary text-white' : '',
                status === 'active' ? 'border-primary bg-white text-primary ring-4 ring-primary/15 dark:bg-slate-900' : '',
                status === 'idle' ? 'border-slate-300 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-900' : '',
              )}>
                {status === 'done' ? <Check className="h-4 w-4" strokeWidth={3} /> : idx + 1}
              </span>

              <p className={clsx('mt-2 hidden text-[11px] font-semibold uppercase tracking-[0.08em] sm:block', status === 'active' ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400')}>
                {step.label}
              </p>
            </div>

            {!last ? (
              <span className="mx-2 h-px flex-1 bg-slate-300 dark:bg-slate-700" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

