import { useEffect, useState, useCallback } from 'react';
import { getUsers, blockUser, unblockUser, deleteUser, exportUsersCsv } from '../../api/admin';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { formatDate, downloadBlob } from '../../utils/formatters';
import { getRoleLabel } from '../../utils/roles';
import toast from 'react-hot-toast';
import { Search, Download } from 'lucide-react';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getUsers({ search, role: roleFilter || undefined });
      setUsers(data.data?.users || data.users || []);
    } catch { /* handled by interceptor */ } finally { setLoading(false); }
  }, [search, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleBlock = async (user) => {
    try {
      if (user.isBlocked) {
        await unblockUser(user.id);
        toast.success('Utilisateur débloqué');
      } else {
        await blockUser(user.id);
        toast.success('Utilisateur bloqué');
      }
      fetchUsers();
    } catch { /* interceptor */ }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(deleteModal.id);
      toast.success('Utilisateur supprimé');
      setDeleteModal(null);
      fetchUsers();
    } catch { /* interceptor */ }
  };

  const handleExport = async () => {
    try {
      const { data } = await exportUsersCsv();
      downloadBlob(data, 'users.csv');
      toast.success('Export CSV téléchargé');
    } catch { /* interceptor */ }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nom', render: (r) => r.name || '—' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Rôle', render: (r) => <Badge variant="role">{r.role}</Badge> },
    {
      key: 'isBlocked', label: 'Statut',
      render: (r) => r.isBlocked
        ? <Badge variant="danger">Bloqué</Badge>
        : <Badge variant="success">Actif</Badge>,
    },
    { key: 'createdAt', label: 'Inscrit le', render: (r) => formatDate(r.createdAt) },
    {
      key: 'actions', label: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          <Button size="sm" variant={r.isBlocked ? 'success' : 'secondary'} onClick={() => handleBlock(r)}>
            {r.isBlocked ? 'Débloquer' : 'Bloquer'}
          </Button>
          <Button size="sm" variant="danger" onClick={() => setDeleteModal(r)}>
            Supprimer
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Utilisateurs</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{users.length} utilisateurs</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white py-2 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">Tous les rôles</option>
          <option value="participant">Participant</option>
          <option value="brand">Marque</option>
          <option value="quizmaster">Quiz Master</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <Table columns={columns} data={users} loading={loading} emptyMessage="Aucun utilisateur trouvé" />

      {/* Delete confirm modal */}
      <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Confirmer la suppression">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Voulez-vous vraiment supprimer <strong>{deleteModal?.email}</strong> ? Cette action est irréversible.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteModal(null)}>Annuler</Button>
          <Button variant="danger" onClick={handleDelete}>Supprimer</Button>
        </div>
      </Modal>
    </div>
  );
}
