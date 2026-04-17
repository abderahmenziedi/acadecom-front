import { useEffect, useState } from 'react';
import { getBrandProducts, createProduct, updateProduct, deleteProduct } from '../../api/store';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';

export default function BrandProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', price: '', stock: '', category: '', imageUrl: '' });

  const fetchProducts = async () => {
    try {
      const { data } = await getBrandProducts();
      setProducts(data.data?.products || data.products || []);
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const resetForm = () => {
    setForm({ title: '', description: '', price: '', stock: '', category: '', imageUrl: '' });
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (product) => {
    setForm({
      title: product.title,
      description: product.description || '',
      price: String(product.price),
      stock: String(product.stock),
      category: product.category || '',
      imageUrl: product.imageUrl || '',
    });
    setEditing(product.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description || undefined,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category || undefined,
        imageUrl: form.imageUrl || undefined,
      };
      if (editing) {
        await updateProduct(editing, payload);
        toast.success('Produit mis à jour');
      } else {
        await createProduct(payload);
        toast.success('Produit créé');
      }
      resetForm();
      fetchProducts();
    } catch { }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return;
    try {
      await deleteProduct(id);
      toast.success('Produit supprimé');
      fetchProducts();
    } catch { }
  };

  if (loading) return <Spinner className="py-24" size="lg" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mes Produits</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Gérez les récompenses de votre boutique</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="h-4 w-4" /> Nouveau Produit
        </Button>
      </div>

      {products.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map(product => (
            <Card key={product.id} className="flex flex-col">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="mb-3 h-36 w-full rounded-lg object-cover" />
              ) : (
                <div className="mb-3 flex h-36 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
                  <Tag className="h-10 w-10 text-primary/30" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{product.title}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{product.description || '—'}</p>
                <div className="mt-2 flex items-center gap-3 text-sm">
                  <span className="font-bold text-secondary">{product.price} coupons</span>
                  <span className="text-gray-400">Stock: {product.stock}</span>
                </div>
              </div>
              <div className="mt-3 flex gap-2 border-t border-gray-100 dark:border-gray-700 pt-3">
                <Button size="sm" variant="outline" onClick={() => openEdit(product)}>
                  <Pencil className="h-4 w-4" /> Modifier
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(product.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Tag className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p className="mt-2 text-gray-500 dark:text-gray-400">Aucun produit. Créez votre premier produit !</p>
        </Card>
      )}

      {/* Product Form Modal */}
      <Modal open={showForm} onClose={resetForm} title={editing ? 'Modifier le Produit' : 'Nouveau Produit'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom du produit"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            required
          />
          <Input
            label="Description"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Prix (coupons)"
              type="number"
              min="1"
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              required
            />
            <Input
              label="Stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
              required
            />
          </div>
          <Input
            label="Catégorie"
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            placeholder="ex: Électronique, Mode..."
          />
          <Input
            label="URL Image"
            value={form.imageUrl}
            onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
            placeholder="https://..."
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={resetForm}>Annuler</Button>
            <Button type="submit" loading={saving}>{editing ? 'Enregistrer' : 'Créer'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
