import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Left — branding panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-dark">
        <div className="max-w-md text-center text-white px-8">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <span className="text-3xl font-bold">A</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">AcadeCom</h1>
          <p className="mt-4 text-lg text-white/80">
            La plateforme interactive de quiz pour l'apprentissage et la communication des marques.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
