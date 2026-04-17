import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getRoleDashboardPath } from '../../utils/roles';
import {
  HiOutlineShieldCheck,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineLightningBolt,
  HiOutlineChartBar,
  HiOutlinePuzzle,
  HiOutlineStar,
  HiOutlineGlobe,
} from 'react-icons/hi';

const roles = [
  {
    key: 'admin',
    title: 'Administrateur',
    desc: 'Gérez les utilisateurs, marques et quiz masters. Supervisez la plateforme et accédez aux statistiques globales.',
    icon: HiOutlineShieldCheck,
    gradient: 'from-red-500 to-rose-600',
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200 hover:border-red-300',
  },
  {
    key: 'brand',
    title: 'Marque',
    desc: 'Suivez les performances de vos quiz masters, consultez les analytiques et gérez votre profil de marque.',
    icon: HiOutlineBriefcase,
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200 hover:border-blue-300',
  },
  {
    key: 'quizmaster',
    title: 'Quiz Master',
    desc: 'Créez et gérez des quiz interactifs, ajoutez des questions et analysez les résultats de vos participants.',
    icon: HiOutlineAcademicCap,
    gradient: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-200 hover:border-purple-300',
  },
  {
    key: 'participant',
    title: 'Participant',
    desc: 'Participez à des quiz, gagnez des points, consultez votre historique et grimpez dans le classement.',
    icon: HiOutlineLightningBolt,
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-200 hover:border-emerald-300',
  },
];

const features = [
  { icon: HiOutlinePuzzle, title: 'Quiz Interactifs', desc: 'Des quiz dynamiques avec minuterie, barre de progression et résultats instantanés.' },
  { icon: HiOutlineChartBar, title: 'Analytiques', desc: 'Tableaux de bord détaillés avec graphiques pour suivre les performances.' },
  { icon: HiOutlineStar, title: 'Gamification', desc: 'Système de points, portefeuille et classement pour motiver les participants.' },
  { icon: HiOutlineGlobe, title: 'Multi-rôles', desc: 'Quatre rôles distincts avec des espaces dédiés et des permissions adaptées.' },
];

export default function Home() {
  const { user, token } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-dark text-white font-bold text-lg">
              A
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">AcadeCom</span>
          </div>
          <div className="flex items-center gap-3">
            {token && user ? (
              <Link
                to={getRoleDashboardPath(user.role)}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark transition-colors"
              >
                Mon Tableau de bord
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Se connecter
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark transition-colors"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <HiOutlineStar className="h-4 w-4" />
              Plateforme Interactive de Quiz
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Apprenez, Jouez,{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Excellez
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-600 sm:text-xl">
              AcadeCom est la plateforme interactive qui connecte les marques, quiz masters et participants
              autour de quiz engageants. Créez, partagez et testez vos connaissances.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/register"
                className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all hover:-translate-y-0.5"
              >
                Commencer gratuitement
              </Link>
              <a
                href="#roles"
                className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
              >
                Découvrir les rôles ↓
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-100 bg-gray-50/50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">Pourquoi AcadeCom ?</h2>
            <p className="mt-3 text-gray-600">
              Une plateforme complète pour l'apprentissage interactif et la communication des marques.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900">Choisissez votre rôle</h2>
            <p className="mt-3 text-gray-600">
              Quatre espaces dédiés pour une expérience adaptée à chaque utilisateur.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {roles.map((r) => (
              <div
                key={r.key}
                className={`group relative rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 ${r.border}`}
              >
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${r.bg}`}>
                  <r.icon className={`h-7 w-7 ${r.text}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{r.title}</h3>
                <p className="mt-2 mb-6 text-sm leading-relaxed text-gray-600">{r.desc}</p>
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    className={`flex-1 rounded-lg border border-current px-3 py-2 text-center text-sm font-medium ${r.text} hover:opacity-80 transition-opacity`}
                  >
                    Connexion
                  </Link>
                  {r.key === 'participant' ? (
                    <Link
                      to="/register"
                      className={`flex-1 rounded-lg bg-gradient-to-r ${r.gradient} px-3 py-2 text-center text-sm font-medium text-white hover:opacity-90 transition-opacity`}
                    >
                      Inscription
                    </Link>
                  ) : (
                    <span className="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-center text-xs font-medium text-gray-500 flex items-center justify-center">
                      Sur invitation
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-gray-100 bg-gradient-to-br from-dark to-primary-dark py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 text-center sm:grid-cols-4">
            {[
              { value: '4', label: 'Rôles distincts' },
              { value: '∞', label: 'Quiz possibles' },
              { value: '100%', label: 'Interactif' },
              { value: '🏆', label: 'Classement & Points' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-4xl font-bold text-white">{s.value}</p>
                <p className="mt-1 text-sm text-white/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Prêt à commencer ?</h2>
          <p className="mt-3 text-lg text-gray-600">
            Rejoignez AcadeCom et découvrez une nouvelle façon d'apprendre et de communiquer.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="rounded-xl bg-primary px-8 py-3 text-base font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all"
            >
              Créer un compte
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-gray-300 bg-white px-8 py-3 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-white text-xs font-bold">A</div>
              <span className="text-sm font-semibold text-gray-900">AcadeCom</span>
            </div>
            <p className="text-sm text-gray-500">© 2026 AcadeCom — Projet de Fin d'Études</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
