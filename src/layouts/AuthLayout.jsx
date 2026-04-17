import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Left - branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-indigo-900">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-primary-light/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-md text-center text-white px-8"
        >
          <Link to="/" className="inline-block mb-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
              <span className="text-3xl font-bold">A</span>
            </div>
          </Link>
          <h1 className="text-4xl font-extrabold tracking-tight">AcadeCom</h1>
          <p className="mt-4 text-lg text-white/70 leading-relaxed">
            La plateforme interactive de quiz pour l'apprentissage et la communication des marques.
          </p>
          <div className="mt-8 flex items-center justify-center gap-6">
            {['Quiz Interactifs', 'Gamification', 'Classement'].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-white/60">
                <div className="h-1.5 w-1.5 rounded-full bg-primary-light" />
                {feature}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right - form */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-light text-white font-bold shadow-lg shadow-primary/20">
                A
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">AcadeCom</span>
            </Link>
          </div>
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
