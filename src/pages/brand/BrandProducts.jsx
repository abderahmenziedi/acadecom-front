import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Tag, Search, Power, PowerOff, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import {
  getBrandProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../api/store';
import { assetUrl } from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import ImageUpload from '../../components/ui/ImageUpload';
import ConfirmModal from '../../components/ui/ConfirmModal';
import EmptyState from '../../components/ui/EmptyState';
import PageHeader from '../../components/ui/PageHeader';
import Pagination from '../../components/ui/Pagination';
import { SkeletonCard } from '../../components/ui/Skeleton';

export default function BrandProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getBrandProducts({ page, limit: 12, search: search || undefined });
      setProducts(data?.data?.products || []);
      setTotalPages(data?.data?.totalPages || 0);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => {
    setForm({ title: '', description: '', price: '', stock: '', category: '', imageUrl: '' });
    setEditing(null);
    setShowForm(false);
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
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
    setEditing(product);
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
        await updateProduct(editing.id, payload);
        toast.success('Produit mis à jour');
      } else {
        await createProduct(payload);
        toast.success('Produit créé');
      }
      resetForm();
      load();
    } catch { /* */ }
    finally { setSaving(false); }
  };

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteProduct(toDelete.id);
      toast.success('Produit supprimé');
      setToDelete(null);
      load();
    } catch { /* */ }
    finally { setDeleting(false); }
  };

  const toggleActive = async (p) => {
    try {
      await updateProduct(p.id, { isActive: !p.isActive });
      toast.success(p.isActive ? 'Produit désactivé' : 'Produit activé');
      load();
    } catch { /* */ }
  };

  return (
    <div>
      <PageHeader
        title="Produits & Coupons"
        subtitle="Catalogue des récompenses échangeables contre les coupons des participants"
        icon={Tag}
        actions={
          <Button onClick={openCreate} icon={Plus}>
            Nouveau produit
          </Button>
        }
      />

      <div className="mb-4 max-w-md">
        <Input
          icon={Search}
          placeholder="Rechercher un produit…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title={search ? 'Aucun résultat' : 'Aucun produit'}
          description={search ? 'Essayez un autre mot-clé.' : 'Créez votre premier produit pour récompenser vos participants.'}
          action={
            !search && (
              <Button icon={Plus} onClick={openCreate}>
                Créer un produit
              </Button>
            )
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Card className="flex flex-col h-full !p-0 overflow-hidden card-hover">
                <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/10 to-accent/10">
                  {product.imageUrl ? (
                    <img
                      src={assetUrl(product.imageUrl)}
                      alt={product.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center">
                      <Tag className="h-12 w-12 text-primary/30" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant={product.isActive ? 'success' : 'neutral'}>
                      {product.isActive ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                </div>

                <div className="flex-1 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {product.title}
                    </h3>
                    {product.category && (
                      <Badge variant="neutral" className="ml-2 capitalize">
                        {product.category}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[2.25rem]">
                    {product.description || '—'}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-secondary">
                      {product.price} <span className="text-xs font-medium text-gray-500">coupons</span>
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Stock: <span className="font-semibold text-gray-700 dark:text-gray-300">{product.stock}</span>
                    </span>
                  </div>
                </div>

                <div className="flex gap-1 border-t border-gray-100 dark:border-gray-700 p-2">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(product)} icon={Pencil} className="flex-1">
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleActive(product)}
                    icon={product.isActive ? PowerOff : Power}
                    title={product.isActive ? 'Désactiver' : 'Activer'}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setToDelete(product)}
                    icon={Trash2}
                    className="text-red-500 hover:text-red-600"
                    title="Supprimer"
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Create / Edit modal */}
      <Modal
        open={showForm}
        onClose={resetForm}
        title={editing ? 'Modifier le produit' : 'Nouveau produit'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <ImageUpload
              value={form.imageUrl}
              onChange={(url) => setForm((f) => ({ ...f, imageUrl: url || '' }))}
              category="product"
              label="Image du produit"
              aspect="aspect-[16/9]"
              hint="JPG/PNG/WEBP · max 4 Mo"
            />
          </div>

          <Input
            label="Titre"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
            className="sm:col-span-2"
          />
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              rows={3}
              className="input"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Description détaillée du produit"
            />
          </div>
          <Input
            label="Prix (coupons)"
            type="number"
            min="1"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            required
          />
          <Input
            label="Stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
            required
          />
          <Input
            label="Catégorie"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            placeholder="Électronique, Mode…"
            className="sm:col-span-2"
          />
          <div className="flex justify-end gap-2 sm:col-span-2 pt-2">
            <Button type="button" variant="ghost" onClick={resetForm}>
              Annuler
            </Button>
            <Button type="submit" loading={saving}>
              {editing ? 'Enregistrer' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Supprimer ce produit ?"
        message={`Le produit « ${toDelete?.title} » sera désactivé puis retiré du catalogue. Cette action est irréversible.`}
        confirmLabel="Supprimer"
        loading={deleting}
        variant="danger"
      />
    </div>
  );
}
