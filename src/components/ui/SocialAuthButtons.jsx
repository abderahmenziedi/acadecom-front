import { clsx } from 'clsx';
import toast from 'react-hot-toast';

function GoogleIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3.02h3.88c2.27-2.09 3.54-5.18 3.54-8.89z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3.02c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54V6.62H1.27a12 12 0 0 0 0 10.76l4-3.11z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.59 1.81l3.44-3.44C17.95 1.18 15.23 0 12 0A12 12 0 0 0 1.27 6.62l4 3.11C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  );
}

function FacebookIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#1877F2" d="M24 12a12 12 0 1 0-13.88 11.85V15.47H7.08V12h3.04V9.36c0-3 1.79-4.66 4.53-4.66 1.31 0 2.69.23 2.69.23v2.95h-1.51c-1.49 0-1.96.93-1.96 1.88V12h3.34l-.53 3.47h-2.81v8.38A12 12 0 0 0 24 12z" />
    </svg>
  );
}

export default function SocialAuthButtons({ className = '', label = 'or continue with' }) {
  const soon = (provider) => toast(`${provider} OAuth will be integrated soon`, { icon: '??' });

  return (
    <div className={className}>
      <div className="relative my-5">
        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-slate-200 dark:bg-slate-700" />
        <p className="relative mx-auto w-fit bg-white px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:bg-slate-900 dark:text-slate-500">
          {label}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <button type="button" onClick={() => soon('Google')} className={clsx('inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800')}>
          <GoogleIcon className="h-4 w-4" /> Google
        </button>
        <button type="button" onClick={() => soon('Facebook')} className={clsx('inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800')}>
          <FacebookIcon className="h-4 w-4" /> Facebook
        </button>
      </div>
    </div>
  );
}

