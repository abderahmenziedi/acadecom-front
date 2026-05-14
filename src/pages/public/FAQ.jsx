import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';
import PublicLayout from '../../components/PublicLayout';

const FAQ_ITEMS = [
  {
    q: 'Comment fonctionne le système de coupons ?',
    a: "Les participants gagnent des coupons en réussissant des quiz. Ils peuvent les échanger contre des produits/services dans la marketplace gérée par les marques.",
  },
  {
    q: 'Qui peut créer des quiz ?',
    a: "Seuls les quizmasters affiliés à une marque peuvent créer des quiz. Chaque quiz est associé automatiquement à la marque de son créateur.",
  },
  {
    q: 'Une marque peut-elle suspendre un quizmaster ?',
    a: "Oui. Depuis l'espace de gestion des quizmasters, la marque peut bloquer, débloquer ou supprimer un quizmaster. Toutes les actions sont auditées.",
  },
  {
    q: 'Comment fonctionnent les notifications ?',
    a: "Le système notifie automatiquement les acteurs concernés : participant après un quiz, quizmaster quand un participant joue, marque lors des activités majeures (création, coupon utilisé, etc.).",
  },
  {
    q: 'Quels formats d\'image sont acceptés ?',
    a: "JPG, PNG, WEBP, GIF et SVG. Taille maximale : 4 Mo par fichier.",
  },
  {
    q: 'Les données sont-elles sécurisées ?',
    a: "Oui. JWT pour l'auth, bcrypt pour les mots de passe, Helmet pour les headers HTTP, validation Zod côté backend et CORS strict.",
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <PublicLayout>
      <section className="bg-app-gradient py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <HelpCircle className="h-4 w-4" /> FAQ
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl text-balance">
            Questions fréquentes
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Tout ce que vous devez savoir avant de commencer.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-3">
          {FAQ_ITEMS.map((item, i) => {
            const open = openIdx === i;
            return (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
              >
                <button
                  onClick={() => setOpenIdx(open ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                >
                  <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={clsx(
                      'h-5 w-5 text-gray-400 transition-transform duration-200 shrink-0',
                      open && 'rotate-180',
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>
    </PublicLayout>
  );
}
