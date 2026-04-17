import { useEffect, useState, useCallback } from 'react';
import { getBrands, createBrand, updateBrand, deleteBrand } from '../../api/admin';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { HiOutlinePlus } from 'react-icons/hi';

export default function ManageBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, brand: null });
  const [form, setForm] = useState({ name: '', email: '', password: '', industry: '', description: '' });
  const [saving, setSaving] = useState(false);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getBrands();
      setBrands(data.data?.brands || data.brands || []);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchBrands(); }, [fetchBrands]);

  const openCreate = () => {
    setForm({ name: '', email: '', password: '', industry: '', description: '' });
    setModal({ open: true, brand: null });
  };

  const openEdit = (b) => {
    setForm({ name: b.name || '', email: b.email, password: '', industry: b.industry || '', description: b.description || '' });
    setModal({ open: true, brand: b });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (modal.brand) {
        const { password, ...rest } = form;
        await updateBrand(modal.brand.id, password ? form : rest);
        toast.success('Marque mise à jour');
      } else {
        await createBrand(form);
        toast.success('Marque créée');
      }
      setModal({ open: false, brand: null });
      fetchBrands();
    } catch {} finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette marque ?')) return;
    await deleteBrand(id);
    toast.success('Marque supprimée');
    fetchBrands();
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nom', render: (r) => r.name || '—' },
    { key: 'email', label: 'Email' },
    { key: 'industry', label: 'Secteur', render: (r) => r.industry || '—' },
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Marques</h1>
          <p className="text-sm text-gray-500">{brands.length} marques</p>
        </div>
        <Button onClick={openCreate}><HiOutlinePlus className="h-4 w-4" /> Nouvelle Marque</Button>
      </div>

      <Table columns={columns} data={brands} loading={loading} />

      <Modal open={modal.open} onClose={() => setModal({ open: false, brand: null })} title={modal.brand ? 'Modifier la Marque' : 'Nouvelle Marque'}>
        <div className="space-y-4">
          <Input label="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {!modal.brand && (
            <Input label="Mot de passe" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          )}
          <Input label="Secteur d'activité" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setModal({ open: false, brand: null })}>Annuler</Button>
            <Button loading={saving} onClick={handleSave}>{modal.brand ? 'Enregistrer' : 'Créer'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
