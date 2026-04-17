import { useAuth } from '../context/AuthContext';
import { getRoleLabel } from '../utils/roles';
import { HiOutlineMenu, HiOutlineBell } from 'react-icons/hi';

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
      >
        <HiOutlineMenu className="h-5 w-5" />
      </button>

      <div className="flex-1" />

      <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100">
        <HiOutlineBell className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-sm font-semibold text-primary">
            {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
          </span>
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-gray-900">{user?.name || user?.email}</p>
          <p className="text-xs text-gray-500">{getRoleLabel(user?.role)}</p>
        </div>
      </div>
    </header>
  );
}
