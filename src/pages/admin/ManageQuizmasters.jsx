import { useEffect, useState, useCallback } from 'react';
import { getQuizmasters, createQuizmaster, updateQuizmaster, deleteQuizmaster, getBrands } from '../../api/admin';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

export default function ManageQuizmasters() {
  const [qms, setQms] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, qm: null });
  const [form, setForm] = useState({ name: '', email: '', password: '', brandId: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [qmRes, bRes] = await Promise.all([getQuizmasters(), getBrands()]);
      setQms(qmRes.data.data?.quizmasters || qmRes.data.quizmasters || []);
      setBrands(bRes.data.data?.brands || bRes.data.brands || []);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setForm({ name: '', email: '', password: '', brandId: brands[0]?.id || '' });
    setModal({ open: true, qm: null });
  };

  const openEdit = (q) => {
    setForm({ name: q.name || '', email: q.email, password: '', brandId: q.brandId || '' });
    setModal({ open: true, qm: q });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, brandId: Number(form.brandId) };
      if (modal.qm) {
        const { password, ...rest } = payload;
        await updateQuizmaster(modal.qm.id, password ? payload : rest);
        toast.success('Quiz Master mis à jour');
      } else {
        await createQuizmaster(payload);
        toast.success('Quiz Master créé');
      }
      setModal({ open: false, qm: null });
      fetchData();
    } catch {} finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce Quiz Master ?')) return;
    await deleteQuizmaster(id);
    toast.success('Quiz Master supprimé');
    fetchData();
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nom', render: (r) => r.name || '—' },
    { key: 'email', label: 'Email' },
    { key: 'brand', label: 'Marque', render: (r) => r.brand?.name || r.brand?.email || '—' },
    { key: 'createdAt', label: 'Créé le', render: (r) => formatDate(r.createdAt) },
    {
      key: 'actions', label: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openEdit(r)}>Modifier</Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(r.id)}>Supprimer</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Quiz Masters</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{qms.length} quiz masters</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Nouveau Quiz Master</Button>
      </div>

      <Table columns={columns} data={qms} loading={loading} />

      <Modal open={modal.open} onClose={() => setModal({ open: false, qm: null })} title={modal.qm ? 'Modifier le Quiz Master' : 'Nouveau Quiz Master'}>
        <div className="space-y-4">
          <Input label="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {!modal.qm && (
            <Input label="Mot de passe" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Marque associée</label>
            <select
              value={form.brandId}
              onChange={(e) => setForm({ ...form, brandId: e.target.value })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Sélectionner une marque</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name || b.email}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setModal({ open: false, qm: null })}>Annuler</Button>
            <Button loading={saving} onClick={handleSave}>{modal.qm ? 'Enregistrer' : 'Créer'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
