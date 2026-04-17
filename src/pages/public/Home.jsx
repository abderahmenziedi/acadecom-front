import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getRoleDashboardPath } from '../../utils/roles';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Briefcase, GraduationCap, Zap,
  BarChart3, Puzzle, Star, Globe,
  ArrowRight, Sun, Moon,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const roles = [
  { key: 'admin', title: 'Administrateur', desc: 'Gérez les utilisateurs, marques et quiz masters.', icon: ShieldCheck, gradient: 'from-red-500 to-rose-600', bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' },
  { key: 'brand', title: 'Marque', desc: 'Suivez les performances et consultez les analytiques.', icon: Briefcase, gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
  { key: 'quizmaster', title: 'Quiz Master', desc: 'Créez et gérez des quiz interactifs.', icon: GraduationCap, gradient: 'from-purple-500 to-violet-600', bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
  { key: 'participant', title: 'Participant', desc: 'Participez, gagnez des points et grimpez au classement.', icon: Zap, gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
];

const features = [
  { icon: Puzzle, title: 'Quiz Interactifs', desc: 'Quiz dynamiques avec minuterie et résultats instantanés.' },
  { icon: BarChart3, title: 'Analytiques', desc: 'Tableaux de bord détaillés avec graphiques de performances.' },
  { icon: Star, title: 'Gamification', desc: 'Points, niveaux, badges et classement pour la motivation.' },
  { icon: Globe, title: 'Multi-rôles', desc: 'Quatre rôles avec espaces dédiés et permissions adaptées.' },
];

export default function Home() {
  const { user, token } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white font-bold shadow-lg shadow-primary/20">A</div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">AcadeCom</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="rounded-xl p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            {token && user ? (
              <Link to={getRoleDashboardPath(user.role)} className="rounded-xl bg-gradient-to-r from-primary to-primary-dark px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                Mon Tableau de bord
              </Link>
            ) : (
              <>
                <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Se connecter</Link>
                <Link to="/register" className="rounded-xl bg-gradient-to-r from-primary to-primary-dark px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">S'inscrire</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 dark:bg-accent/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <motion.div initial="hidden" animate="visible" className="mx-auto max-w-3xl text-center">
            <motion.div variants={fadeUp} custom={0} className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 dark:bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary">
              <Star className="h-4 w-4" /> Plateforme Interactive de Quiz
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              Apprenez, Jouez,{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Excellez</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400 sm:text-xl">
              AcadeCom connecte marques, quiz masters et participants autour de quiz engageants. Créez, partagez et testez vos connaissances.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link to="/register" className="group rounded-xl bg-gradient-to-r from-primary to-primary-dark px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 flex items-center gap-2">
                Commencer gratuitement <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#roles" className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-7 py-3.5 text-base font-semibold text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                Découvrir les rôles
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Pourquoi AcadeCom ?</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">Une plateforme complète pour l'apprentissage interactif.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20 group-hover:scale-110 transition-transform">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="py-16 sm:py-20 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Choisissez votre rôle</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">Quatre espaces dédiés pour chaque utilisateur.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {roles.map((r, i) => (
              <motion.div
                key={r.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${r.bg}`}>
                  <r.icon className={`h-7 w-7 ${r.text}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{r.title}</h3>
                <p className="mt-2 mb-6 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{r.desc}</p>
                <div className="flex gap-2">
                  <Link to="/login" className={`flex-1 rounded-xl border border-current px-3 py-2 text-center text-sm font-medium ${r.text} hover:opacity-80 transition-opacity`}>
                    Connexion
                  </Link>
                  {r.key === 'participant' ? (
                    <Link to="/register" className={`flex-1 rounded-xl bg-gradient-to-r ${r.gradient} px-3 py-2 text-center text-sm font-medium text-white hover:opacity-90 transition-opacity`}>
                      Inscription
                    </Link>
                  ) : (
                    <span className="flex-1 rounded-xl bg-gray-100 dark:bg-gray-700 px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center justify-center">
                      Sur invitation
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-gray-100 dark:border-gray-800 bg-gradient-to-br from-gray-900 to-primary-dark py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 text-center sm:grid-cols-4">
            {[
              { value: '4', label: 'Rôles distincts' },
              { value: '∞', label: 'Quiz possibles' },
              { value: '100%', label: 'Interactif' },
              { value: '🏆', label: 'Classement & Points' },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <p className="text-4xl font-bold text-white">{s.value}</p>
                <p className="mt-1 text-sm text-white/60">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 dark:bg-gray-950">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Prêt à commencer ?</h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">Rejoignez AcadeCom et découvrez une nouvelle façon d'apprendre.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="rounded-xl bg-gradient-to-r from-primary to-primary-dark px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5">
              Créer un compte
            </Link>
            <Link to="/login" className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-8 py-3.5 text-base font-semibold text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-dark text-white text-xs font-bold">A</div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">AcadeCom</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">© 2026 AcadeCom — Projet de Fin d'Études</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
