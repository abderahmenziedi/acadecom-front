import { useEffect, useState, useCallback } from 'react';
import { Search, Download, Users, Ban, ShieldCheck, Trash2, Filter } from 'lucide-react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

import {
  getUsers,
  blockUser,
  unblockUser,
  deleteUser,
  exportUsersCsv,
} from '../../api/admin';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import PageHeader from '../../components/ui/PageHeader';
import Pagination from '../../components/ui/Pagination';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { formatDate, downloadBlob } from '../../utils/formatters';

const STATUS_FILTERS = [
  { id: 'all', label: 'Tous', value: undefined },
  { id: 'active', label: 'Actifs', value: 'false' },
  { id: 'blocked', label: 'Bloqués', value: 'true' },
];

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pending, setPending] = useState(null);
  const [working, setWorking] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const status = STATUS_FILTERS.find((s) => s.id === statusFilter)?.value;
      if (status !== undefined) params.isBlocked = status;

      const { data } = await getUsers(params);
      setUsers(data?.data?.users || []);
      setTotalPages(data?.data?.totalPages || 0);
      setTotal(data?.data?.total || 0);
    } catch { /* handled by interceptor */ } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleConfirm = async () => {
    if (!pending) return;
    setWorking(true);
    try {
      const { type, user } = pending;
      if (type === 'block') {
        await blockUser(user.id);
        toast.success('Utilisateur bloqué');
      } else if (type === 'unblock') {
        await unblockUser(user.id);
        toast.success('Utilisateur débloqué');
      } else if (type === 'delete') {
        await deleteUser(user.id);
        toast.success('Utilisateur supprimé');
      }
      setPending(null);
      fetchUsers();
    } catch { /* */ } finally {
      setWorking(false);
    }
  };

  const handleExport = async () => {
    try {
      const { data } = await exportUsersCsv();
      downloadBlob(data, `users_${new Date().toISOString().slice(0, 10)}.csv`);
      toast.success('Export CSV téléchargé');
    } catch { /* */ }
  };

  const columns = [
    {
      key: 'name',
      label: 'Utilisateur',
      render: (r) => (
        <div className="flex items-center gap-3">
          <Avatar src={r.avatar} name={r.name || r.email} size="sm" />
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white truncate">
              {r.name || '—'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{r.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'role', label: 'Rôle', render: (r) => <Badge variant="role">{r.role}</Badge> },
    {
      key: 'isBlocked',
      label: 'Statut',
      render: (r) => (
        <Badge variant={r.isBlocked ? 'danger' : 'success'} dot>
          {r.isBlocked ? 'Bloqué' : 'Actif'}
        </Badge>
      ),
    },
    { key: 'createdAt', label: 'Inscrit le', render: (r) => formatDate(r.createdAt) },
    {
      key: 'actions',
      label: '',
      render: (r) => (
        <div className="flex justify-end gap-1">
          {r.role !== 'admin' && (
            <>
              {r.isBlocked ? (
                <Button
                  size="sm"
                  variant="ghost"
                  icon={ShieldCheck}
                  onClick={() => setPending({ type: 'unblock', user: r })}
                  title="Débloquer"
                />
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  icon={Ban}
                  onClick={() => setPending({ type: 'block', user: r })}
                  title="Bloquer"
                />
              )}
              <Button
                size="sm"
                variant="ghost"
                icon={Trash2}
                onClick={() => setPending({ type: 'delete', user: r })}
                className="text-red-500 hover:text-red-600"
                title="Supprimer"
              />
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Utilisateurs"
        subtitle={`${total} comptes au total · gestion globale de la plateforme`}
        icon={Users}
        actions={
          <Button variant="outline" onClick={handleExport} icon={Download}>
            Export CSV
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <Input
          icon={Search}
          placeholder="Rechercher par nom ou email…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 min-w-[16rem]"
        />
        <Select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="w-40"
        >
          <option value="">Tous les rôles</option>
          <option value="participant">Participant</option>
          <option value="brand">Marque</option>
          <option value="quizmaster">Quiz Master</option>
          <option value="admin">Admin</option>
        </Select>
        <div className="flex items-center gap-1.5">
          <Filter className="h-4 w-4 text-gray-400" />
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => { setStatusFilter(f.id); setPage(1); }}
              className={clsx(
                'rounded-xl px-3 py-1.5 text-sm font-medium transition-colors',
                statusFilter === f.id
                  ? 'bg-primary text-white'
                  : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-primary',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <Table
        columns={columns}
        data={users}
        loading={loading}
        emptyMessage={search || roleFilter ? 'Aucun résultat' : 'Aucun utilisateur'}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <ConfirmModal
        open={!!pending}
        onClose={() => setPending(null)}
        onConfirm={handleConfirm}
        title={
          pending?.type === 'delete'
            ? 'Supprimer cet utilisateur ?'
            : pending?.type === 'block'
              ? 'Bloquer cet utilisateur ?'
              : 'Débloquer cet utilisateur ?'
        }
        message={
          pending?.type === 'delete'
            ? `Toutes les données associées à ${pending?.user?.email} seront supprimées définitivement.`
            : pending?.type === 'block'
              ? `${pending?.user?.email} ne pourra plus se connecter à la plateforme.`
              : `${pending?.user?.email} pourra de nouveau se connecter.`
        }
        confirmLabel={
          pending?.type === 'delete' ? 'Supprimer'
            : pending?.type === 'block' ? 'Bloquer'
              : 'Débloquer'
        }
        variant={pending?.type === 'unblock' ? 'warning' : 'danger'}
        requireType={pending?.type === 'delete'}
        loading={working}
      />
    </div>
  );
}
