import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import PublicLayout from '../../components/PublicLayout';

const PLANS = [
  {
    name: 'Starter',
    price: 'Gratuit',
    period: '',
    description: "Idéal pour découvrir la plateforme et lancer une première campagne.",
    features: [
      'Jusqu\'à 3 quiz actifs',
      '1 quizmaster',
      '100 participations / mois',
      'Notifications en temps réel',
      'Dark mode + responsive',
    ],
    cta: 'Commencer gratuitement',
    href: '/register',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '49€',
    period: '/mois',
    description: 'Pour les marques en croissance et les communautés engagées.',
    features: [
      'Quiz et quizmasters illimités',
      'Analytiques avancées + exports CSV',
      'Marketplace coupons',
      'Audit log complet',
      'Upload illimité',
      'Support prioritaire',
    ],
    cta: 'Choisir Pro',
    href: '/register',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Sur devis',
    period: '',
    description: 'Pour les organisations avec besoins spécifiques.',
    features: [
      'SLA dédié',
      'SSO & intégrations sur mesure',
      'Marque blanche',
      'Accompagnement et formations',
      'Roadmap conjointe',
    ],
    cta: 'Nous contacter',
    href: '/contact',
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <PublicLayout>
      <section className="bg-app-gradient py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" /> Tarifs
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl text-balance">
            Un plan pour chaque ambition
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Démarrez gratuitement, montez en puissance quand vous voulez.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={clsx(
                  'rounded-2xl border p-8 shadow-sm flex flex-col',
                  plan.highlighted
                    ? 'border-primary bg-gradient-to-br from-primary/5 to-accent/5 ring-2 ring-primary/30 relative'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
                )}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-md">
                    Le plus populaire
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">{plan.period}</span>
                  )}
                </div>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.href}
                  className={clsx(
                    'mt-8 inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-all',
                    plan.highlighted
                      ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5'
                      : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800',
                  )}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
