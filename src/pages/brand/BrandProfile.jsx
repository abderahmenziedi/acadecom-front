import { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../../api/brand';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function BrandProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', industry: '', description: '' });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getProfile();
        const p = data.data?.brand || data.brand || data;
        setProfile(p);
        setForm({ name: p.name || '', industry: p.industry || '', description: p.description || '' });
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success('Profil mis à jour');
    } catch {} finally { setSaving(false); }
  };

  if (loading) return <Spinner className="py-24" size="lg" />;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
        <p className="text-sm text-gray-500">Gérez les informations de votre marque</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Informations</CardTitle></CardHeader>
        <div className="space-y-4">
          <Input label="Email" value={profile?.email || ''} disabled />
          <Input label="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Secteur d'activité" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex justify-end">
            <Button loading={saving} onClick={handleSave}>Enregistrer</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
