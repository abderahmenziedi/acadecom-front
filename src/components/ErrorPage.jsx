import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import Button from './ui/Button';

/**
 * ErrorPage
 * ---------
 * Shared error layout used by 403 / 404 / 500.
 *
 * Props:
 *  - code        (string) e.g. "404"
 *  - title       (string)
 *  - description (string)
 *  - icon        (Lucide component)
 *  - tone        ("primary" | "danger" | "warning")
 *  - homeHref    (string)
 */
const tones = {
  primary: {
    badge: 'bg-primary/10 text-primary',
    code: 'from-primary to-accent',
    glow: 'bg-primary/30',
  },
  danger: {
    badge: 'bg-red-500/10 text-red-500',
    code: 'from-red-500 to-orange-500',
    glow: 'bg-red-500/30',
  },
  warning: {
    badge: 'bg-amber-500/10 text-amber-600',
    code: 'from-amber-500 to-orange-500',
    glow: 'bg-amber-500/25',
  },
};

export default function ErrorPage({
  code,
  title,
  description,
  icon: Icon,
  tone = 'primary',
  homeHref = '/',
}) {
  const navigate = useNavigate();
  const t = tones[tone] || tones.primary;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-950 p-6">
      {/* Decorative blobs */}
      <div className={`pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full ${t.glow} blur-3xl opacity-40 animate-blob`} />
      <div className={`pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full ${t.glow} blur-3xl opacity-30 animate-blob`} style={{ animationDelay: '4s' }} />
      <div className="absolute inset-0 bg-dots opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
        className="relative z-10 w-full max-w-lg text-center"
      >
        {Icon && (
          <div className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${t.badge}`}>
            <Icon className="h-7 w-7" />
          </div>
        )}

        {code && (
          <p className={`text-7xl sm:text-8xl font-extrabold tracking-tight bg-gradient-to-r ${t.code} bg-clip-text text-transparent text-display`}>
            {code}
          </p>
        )}

        <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-balance">
          {title}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-400 text-pretty">
          {description}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="outline"
            icon={ArrowLeft}
            onClick={() => navigate(-1)}
          >
            Retour
          </Button>
          <Link to={homeHref}>
            <Button variant="gradient" icon={Home}>
              Aller à l’accueil
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
