import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getRoleDashboardPath } from '../utils/roles';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const NAV_LINKS = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/features', label: 'Fonctionnalités' },
  { to: '/about', label: 'À propos' },
  { to: '/pricing', label: 'Tarifs' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

export function PublicNavbar() {
  const { user, token } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white font-bold shadow-lg shadow-primary/20">
            A
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            AcadeCom
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                clsx(
                  'rounded-xl px-3.5 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="rounded-xl p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Changer de thème"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {token && user ? (
            <Link
              to={getRoleDashboardPath(user.role)}
              className="hidden sm:inline-flex rounded-xl bg-gradient-to-r from-primary to-primary-dark px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 hover:shadow-primary/40 transition-shadow"
            >
              Tableau de bord
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-flex rounded-xl px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Se connecter
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-gradient-to-r from-primary to-primary-dark px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 hover:shadow-primary/40 transition-shadow"
              >
                S'inscrire
              </Link>
            </>
          )}

          <button
            onClick={() => setOpen(true)}
            className="md:hidden rounded-xl p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden bg-white dark:bg-gray-950"
          >
            <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
              <span className="text-lg font-bold text-gray-900 dark:text-white">Menu</span>
              <button onClick={() => setOpen(false)} className="rounded-xl p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-1">
              {NAV_LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    clsx(
                      'block rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                    )
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white font-bold">
                A
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">AcadeCom</span>
            </div>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              La plateforme SaaS pour des quiz interactifs et la fidélisation par la gamification.
            </p>
          </div>

          <FooterColumn
            title="Produit"
            links={[
              { to: '/features', label: 'Fonctionnalités' },
              { to: '/pricing', label: 'Tarifs' },
              { to: '/faq', label: 'FAQ' },
            ]}
          />
          <FooterColumn
            title="Entreprise"
            links={[
              { to: '/about', label: 'À propos' },
              { to: '/contact', label: 'Contact' },
            ]}
          />
          <FooterColumn
            title="Compte"
            links={[
              { to: '/login', label: 'Connexion' },
              { to: '/register', label: 'Inscription' },
            ]}
          />
        </div>

        <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} AcadeCom — Projet de Fin d'Études · Tous droits réservés
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h4>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PublicLayout({ children, className = '' }) {
  return (
    <div className={clsx('min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors', className)}>
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
