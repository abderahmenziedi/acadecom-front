export const ROLES = {
  ADMIN: 'admin',
  BRAND: 'brand',
  QUIZMASTER: 'quizmaster',
  PARTICIPANT: 'participant',
};

export function getRoleDashboardPath(role) {
  switch (role) {
    case ROLES.ADMIN: return '/admin';
    case ROLES.BRAND: return '/brand';
    case ROLES.QUIZMASTER: return '/quizmaster';
    case ROLES.PARTICIPANT: return '/participant';
    default: return '/login';
  }
}

export function getRoleLabel(role) {
  switch (role) {
    case ROLES.ADMIN: return 'Administrateur';
    case ROLES.BRAND: return 'Marque';
    case ROLES.QUIZMASTER: return 'Quiz Master';
    case ROLES.PARTICIPANT: return 'Participant';
    default: return role;
  }
}

export function getRoleColor(role) {
  switch (role) {
    case ROLES.ADMIN:
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case ROLES.BRAND:
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case ROLES.QUIZMASTER:
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    case ROLES.PARTICIPANT:
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  }
}
