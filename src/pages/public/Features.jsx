import { motion } from 'framer-motion';
import {
  Puzzle, BarChart3, Bell, ShieldCheck, Trophy, ShoppingBag,
  Upload, History, GraduationCap, Sparkles,
} from 'lucide-react';
import PublicLayout from '../../components/PublicLayout';

const FEATURES = [
  {
    icon: Puzzle, title: 'Création de quiz no-code',
    desc: 'Constructeur visuel : QCM, points par question, temps limite, mélange et difficulté graduée.',
  },
  {
    icon: BarChart3, title: 'Analytiques avancées',
    desc: 'Dashboards KPI, taux de complétion, score moyen, durée moyenne et exports CSV.',
  },
  {
    icon: Trophy, title: 'Gamification complète',
    desc: 'XP, niveaux progressifs, badges débloqués automatiquement, classement et streaks.',
  },
  {
    icon: ShoppingBag, title: 'Marketplace de récompenses',
    desc: 'Les coupons gagnés s’échangent dans la boutique gérée par les marques.',
  },
  {
    icon: Bell, title: 'Notifications temps réel',
    desc: 'Bell, dropdown, page dédiée. Marques, quizmasters et participants restent synchronisés.',
  },
  {
    icon: ShieldCheck, title: 'Sécurité & RBAC',
    desc: 'JWT, Helmet, Zod, bcrypt, gestion fine des permissions par rôle.',
  },
  {
    icon: Upload, title: 'Uploads sécurisés',
    desc: 'Drag & drop, validation MIME, preview, suppression — JPG/PNG/WEBP jusqu’à 4 Mo.',
  },
  {
    icon: History, title: 'Audit log',
    desc: 'Toutes les actions sensibles sont historisées par marque (création, blocage, suppression).',
  },
  {
    icon: GraduationCap, title: 'Espaces dédiés',
    desc: 'Admin, marque, quizmaster, participant : chaque rôle bénéficie d\'un dashboard adapté.',
  },
];

export default function Features() {
  return (
    <PublicLayout>
      <section className="bg-app-gradient py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" /> Fonctionnalités
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl text-balance">
            Tout ce qu'il faut pour une vraie plateforme SaaS
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Des features pensées pour le quotidien, pas juste pour faire joli.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm card-hover"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
