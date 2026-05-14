import { useRef, useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { Upload, ImagePlus, X, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImage } from '../../api/uploads';
import { assetUrl } from '../../api/axios';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_SIZE_MB = 4;

/**
 * ImageUpload
 * -----------
 * Drag & drop image picker with live preview and progress bar.
 *
 * Props:
 *  - value          (string)   — current image URL (relative `/uploads/...` or absolute)
 *  - onChange       (fn)       — called with new image URL or null
 *  - category       (string)   — backend bucket (avatar, quiz, product, brand, generic)
 *  - aspect         (string)   — tailwind aspect class (default `aspect-video`)
 *  - shape          ("rounded"|"square"|"circle")
 *  - className      (string)
 *  - label          (string)
 *  - hint           (string)   — optional helper text
 */
export default function ImageUpload({
  value,
  onChange,
  category = 'generic',
  aspect = 'aspect-video',
  shape = 'rounded',
  className = '',
  label,
  hint,
}) {
  const inputRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);

  const handleFiles = useCallback(async (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!ALLOWED_TYPES.includes(file.type)) {
      const msg = `Format non supporté (${file.type || 'inconnu'}). JPG, PNG, WEBP, GIF, SVG autorisés.`;
      setError(msg);
      toast.error(msg);
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      const msg = `Fichier trop volumineux (max ${MAX_SIZE_MB} Mo).`;
      setError(msg);
      toast.error(msg);
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);
    try {
      const url = await uploadImage(file, category, setProgress);
      if (url) {
        onChange?.(url);
        toast.success('Image téléversée');
      }
    } catch (err) {
      // axios interceptor already toasts, just keep local state
      setError(err?.response?.data?.message || 'Échec du téléversement');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [category, onChange]);

  const onInputChange = (e) => handleFiles(e.target.files);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const previewUrl = value ? assetUrl(value) : null;

  const shapeClass =
    shape === 'circle' ? 'rounded-full' : shape === 'square' ? 'rounded-2xl' : 'rounded-2xl';

  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={clsx(
          'relative group overflow-hidden cursor-pointer transition-all duration-200',
          shapeClass,
          aspect,
          'border-2 border-dashed',
          dragOver
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 dark:border-gray-700 hover:border-primary/60 hover:bg-gray-50 dark:hover:bg-gray-800/50',
          'flex items-center justify-center',
        )}
        role="button"
        tabIndex={0}
      >
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="aperçu"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex items-center gap-2 rounded-xl bg-white/90 dark:bg-gray-800/90 px-4 py-2 text-sm font-medium text-gray-900 dark:text-white shadow-lg backdrop-blur-sm">
                <Upload className="h-4 w-4" /> Changer
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <ImagePlus className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Glissez-déposez une image
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ou cliquez pour parcourir · JPG/PNG/WEBP · max {MAX_SIZE_MB} Mo
            </p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 text-white backdrop-blur-sm">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-sm font-medium">Téléversement… {progress}%</p>
            <div className="w-2/3 h-1.5 rounded-full bg-white/20 overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>
        )}

        {value && !uploading && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange?.(null);
              setError(null);
            }}
            className="absolute top-2 right-2 rounded-full bg-white/95 p-1.5 text-gray-700 shadow-md hover:bg-red-500 hover:text-white transition-colors"
            title="Supprimer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onInputChange}
      />

      {(error || hint) && (
        <p className={clsx(
          'mt-2 flex items-center gap-1.5 text-xs',
          error ? 'text-danger' : 'text-gray-500 dark:text-gray-400',
        )}>
          {error && <AlertCircle className="h-3.5 w-3.5" />}
          {error || hint}
        </p>
      )}
    </div>
  );
}
