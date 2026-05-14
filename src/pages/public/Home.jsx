import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Briefcase, GraduationCap, Zap,
  BarChart3, Puzzle, Star, Globe, Award, Bell,
  ArrowRight, Sparkles, CheckCircle2,
} from 'lucide-react';
import PublicLayout from '../../components/PublicLayout';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const roles = [
  { key: 'admin', title: 'Administrateur', desc: 'Gérez les utilisateurs, marques et quizmasters.', icon: ShieldCheck, gradient: 'from-red-500 to-rose-600', bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' },
  { key: 'brand', title: 'Marque', desc: 'Pilotez vos quizmasters, suivez vos quiz, échangez les coupons.', icon: Briefcase, gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
  { key: 'quizmaster', title: 'Quiz Master', desc: 'Créez des quiz immersifs et analysez la performance.', icon: GraduationCap, gradient: 'from-purple-500 to-violet-600', bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
  { key: 'participant', title: 'Participant', desc: 'Jouez, gagnez des coupons et débloquez des récompenses.', icon: Zap, gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
];

const features = [
  { icon: Puzzle, title: 'Quiz Interactifs', desc: 'Création no-code, minuterie, mélange de questions et difficulté graduée.' },
  { icon: BarChart3, title: 'Analytiques temps réel', desc: 'Dashboards KPI, taux de complétion, scores moyens, tendances.' },
  { icon: Star, title: 'Gamification', desc: 'XP, niveaux, badges et classement pour booster l\'engagement.' },
  { icon: Bell, title: 'Notifications', desc: 'Alertes contextuelles pour participants, quizmasters et marques.' },
  { icon: Award, title: 'Récompenses', desc: 'Coupons, boutique marketplace et commandes confirmées.' },
  { icon: Globe, title: 'Multi-rôles', desc: 'RBAC strict, espaces dédiés, audit log et sécurité de niveau pro.' },
];

const highlights = [
  'Architecture modulaire Express + Prisma + MySQL',
  'Validation Zod, JWT, RBAC et audit log',
  'React 19, Vite, Tailwind v4 et Framer Motion',
  'Upload sécurisé, dark mode, responsive premium',
];

export default function Home() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-app-gradient">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 dark:bg-accent/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <motion.div initial="hidden" animate="visible" className="mx-auto max-w-3xl text-center">
            <motion.div
              variants={fadeUp}
              custom={0}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
            >
              <Sparkles className="h-4 w-4" /> Plateforme SaaS — PFE 2026
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl text-balance">
              Quiz interactifs,{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                récompenses réelles
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400 sm:text-xl text-pretty">
              AcadeCom connecte marques, quizmasters et participants. Créez, jouez et fidélisez votre audience avec
              une boucle de gamification professionnelle.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
              >
                Commencer gratuitement
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/features"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-7 py-3.5 text-base font-semibold text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                Voir les fonctionnalités
              </Link>
            </motion.div>

            <motion.ul
              variants={fadeUp}
              custom={4}
              className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400"
            >
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-success" /> {h}
                </li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Une plateforme tout-en-un
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Conçue pour les équipes marketing modernes et les communautés engagées.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
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
      <section id="roles" className="py-16 sm:py-24 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Quatre rôles, une expérience
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Chaque acteur dispose d'un espace dédié pensé pour son usage quotidien.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {roles.map((r, i) => (
              <motion.div
                key={r.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${r.bg}`}>
                  <r.icon className={`h-7 w-7 ${r.text}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{r.title}</h3>
                <p className="mt-2 mb-6 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {r.desc}
                </p>
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    className={`flex-1 rounded-xl border border-current px-3 py-2 text-center text-sm font-medium ${r.text} hover:opacity-80 transition-opacity`}
                  >
                    Connexion
                  </Link>
                  {r.key === 'participant' ? (
                    <Link
                      to="/register"
                      className={`flex-1 rounded-xl bg-gradient-to-r ${r.gradient} px-3 py-2 text-center text-sm font-medium text-white hover:opacity-90 transition-opacity`}
                    >
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
              { value: '100%', label: 'Responsive & moderne' },
              { value: '🏆', label: 'Gamification complète' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <p className="text-4xl font-extrabold text-white">{s.value}</p>
                <p className="mt-1 text-sm text-white/60">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Prêt à transformer vos campagnes ?
          </h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            Rejoignez AcadeCom et déployez votre première campagne de quiz en moins de 10 minutes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="rounded-xl bg-gradient-to-r from-primary to-primary-dark px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
            >
              Créer un compte
            </Link>
            <Link
              to="/contact"
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-8 py-3.5 text-base font-semibold text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Demander une démo
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
