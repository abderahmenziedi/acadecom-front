import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

/**
 * ConfirmModal
 * ------------
 * Secure confirmation prompt for destructive actions. Optionally requires the
 * user to type a phrase (default: "CONFIRMER") before the action button is enabled.
 */
export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = 'Êtes-vous sûr ?',
  message = 'Cette action est irréversible.',
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  variant = 'danger',
  loading = false,
  requireType = false,
  typePhrase = 'CONFIRMER',
}) {
  const [typed, setTyped] = useState('');

  const handleClose = () => {
    setTyped('');
    onClose?.();
  };

  const canConfirm = !requireType || typed.trim() === typePhrase;

  const handleConfirm = async () => {
    if (!canConfirm) return;
    await onConfirm?.();
    setTyped('');
  };

  return (
    <Modal open={open} onClose={handleClose} title={title} size="sm">
      <div className="flex gap-4">
        <div className={`shrink-0 rounded-2xl p-3 ${variant === 'danger' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'}`}>
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>

          {requireType && (
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                Tapez <span className="font-mono font-semibold">{typePhrase}</span> pour confirmer
              </label>
              <input
                autoFocus
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                className="input mt-2"
                placeholder={typePhrase}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={handleClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          variant={variant === 'danger' ? 'danger' : 'primary'}
          onClick={handleConfirm}
          loading={loading}
          disabled={!canConfirm || loading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
