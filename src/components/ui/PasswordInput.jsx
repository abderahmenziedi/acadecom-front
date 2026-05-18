import { forwardRef, useId, useState } from 'react';
import { clsx } from 'clsx';
import { Eye, EyeOff, Lock } from 'lucide-react';

const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];

function score(value = '') {
  if (!value) return -1;
  let s = 0;
  if (value.length >= 8) s += 1;
  if (value.length >= 12) s += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) s += 1;
  if (/\d/.test(value)) s += 1;
  if (/[^A-Za-z0-9]/.test(value)) s += 1;
  return Math.min(s, 4);
}

function strengthColor(level) {
  if (level <= 1) return 'var(--color-danger)';
  if (level === 2) return 'var(--color-warning)';
  return 'var(--color-success)';
}

const PasswordInput = forwardRef(function PasswordInput(
  {
    label,
    error,
    hint,
    showStrength = false,
    icon: Icon = Lock,
    className = '',
    value,
    id,
    ...props
  },
  ref,
) {
  const [visible, setVisible] = useState(false);
  const generatedId = useId();
  const inputId = id || generatedId;
  const strength = showStrength ? score(value || '') : -1;

  return (
    <div className={className}>
      {label ? (
        <label htmlFor={inputId} className="ds-label">
          {label}
        </label>
      ) : null}

      <div className="relative">
        <span
          className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>

        <input
          id={inputId}
          ref={ref}
          type={visible ? 'text' : 'password'}
          value={value}
          className={clsx(
            'ds-input pl-10 pr-10',
            error && 'ds-input-error',
          )}
          {...props}
        />

        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="ds-icon-btn absolute inset-y-0 right-0"
          aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        >
          {visible ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
        </button>
      </div>

      {showStrength && strength >= 0 ? (
        <div className="mt-2">
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="h-1 w-full rounded-full"
                style={{
                  background: i <= strength ? strengthColor(strength) : 'var(--border)',
                }}
              />
            ))}
          </div>
          <p className="mt-1 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
            Strength: <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{labels[strength]}</span>
          </p>
        </div>
      ) : null}

      {error ? <p className="ds-field-error">{error}</p> : null}
      {!error && hint ? (
        <p className="mt-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export default PasswordInput;
