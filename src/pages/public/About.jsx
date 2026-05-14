import { motion } from 'framer-motion';
import { Target, Heart, Zap, Sparkles, Users, Code2 } from 'lucide-react';
import PublicLayout from '../../components/PublicLayout';

const values = [
  { icon: Target, title: 'Mission', text: "Réinventer l'engagement entre marques et communautés grâce à des quiz interactifs." },
  { icon: Heart, title: 'Pédagogie', text: "Allier ludique et apprentissage pour fidéliser sans frustrer." },
  { icon: Zap, title: 'Performance', text: "Une plateforme rapide, moderne et optimisée jusque dans les détails." },
  { icon: Sparkles, title: 'Design', text: "Une UX premium pensée comme une vraie startup SaaS." },
];

const team = [
  { role: 'Architecture', desc: 'Backend Node/Express modulaire avec Prisma, Zod et logs structurés.', icon: Code2 },
  { role: 'Produit', desc: 'Quatre rôles, RBAC, gamification, audit log et notifications temps réel.', icon: Users },
];

export default function About() {
  return (
    <PublicLayout>
      <section className="bg-app-gradient py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl text-balance"
          >
            Donner du <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">sens</span> à l'engagement
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400 text-pretty"
          >
            AcadeCom est un projet de fin d'études qui pousse les standards d'une plateforme SaaS moderne :
            architecture propre, design system cohérent, gamification réelle et expérience polie.
          </motion.p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm card-hover"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{v.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/50 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Une vision technique solide
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600 dark:text-gray-400">
            Pensé pour scaler tout en restant lisible.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {team.map((t) => (
              <div key={t.role} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <t.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.role}</h3>
                </div>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
