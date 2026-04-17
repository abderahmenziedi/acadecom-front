import { useEffect, useState } from 'react';
import { getProducts, getCategories, createOrder } from '../../api/store';
import { getGamificationProfile } from '../../api/gamification';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';
import { ShoppingCart, Tag, Gift, Filter } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export default function Store() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [prodRes, catRes, profRes] = await Promise.all([
          getProducts(),
          getCategories(),
          getGamificationProfile(),
        ]);
        setProducts(prodRes.data?.data?.products || prodRes.data?.products || []);
        setCategories(catRes.data?.data?.categories || catRes.data?.categories || []);
        setProfile(profRes.data?.data?.profile || profRes.data?.profile || {});
      } catch { }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) {
        return prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { productId: product.id, quantity: 1, product }];
    });
    toast.success(`${product.title} ajouté au panier`);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  };

  const updateQuantity = (productId, qty) => {
    if (qty < 1) return removeFromCart(productId);
    setCart(prev => prev.map(i => i.productId === productId ? { ...i, quantity: qty } : i));
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const handleOrder = async () => {
    if (cart.length === 0) return;
    setOrdering(true);
    try {
      await createOrder({ items: cart.map(({ productId, quantity }) => ({ productId, quantity })) });
      toast.success('Commande passée avec succès !');
      setCart([]);
      setShowCart(false);
      // Refresh profile (coupons deducted)
      const profRes = await getGamificationProfile();
      setProfile(profRes.data?.data?.profile || profRes.data?.profile || {});
    } catch { }
    finally { setOrdering(false); }
  };

  if (loading) return <Spinner className="py-24" size="lg" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Boutique</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Échangez vos coupons contre des récompenses exclusives</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-secondary/10 dark:bg-secondary/20 px-4 py-2">
            <Gift className="h-5 w-5 text-secondary" />
            <span className="font-bold text-secondary">{profile?.coupons ?? 0} coupons</span>
          </div>
          <Button variant="outline" onClick={() => setShowCart(true)} className="relative">
            <ShoppingCart className="h-5 w-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </Button>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={clsx(
              'flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              selectedCategory === 'all' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
            )}
          >
            <Filter className="h-4 w-4" /> Tout
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={clsx(
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                selectedCategory === cat ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="flex flex-col justify-between hover:shadow-lg transition-all">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.title} className="mb-4 h-40 w-full rounded-xl object-cover" />
                ) : (
                  <div className="mb-4 flex h-40 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20">
                    <Tag className="h-12 w-12 text-primary/40" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{product.title}</h3>
                    {product.category && (
                      <span className="shrink-0 rounded-full bg-accent/10 dark:bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent">
                        {product.category}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{product.description || 'Aucune description'}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                    <span>Stock: {product.stock}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4">
                  <div className="flex items-center gap-1">
                    <Gift className="h-5 w-5 text-secondary" />
                    <span className="text-lg font-bold text-secondary">{product.price}</span>
                    <span className="text-sm text-gray-400">coupons</span>
                  </div>
                  <Button
                    size="sm"
                    disabled={product.stock < 1 || (profile?.coupons ?? 0) < product.price}
                    onClick={() => addToCart(product)}
                  >
                    {product.stock < 1 ? 'Épuisé' : 'Ajouter'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p className="mt-2 text-gray-500 dark:text-gray-400">Aucun produit disponible dans cette catégorie.</p>
        </Card>
      )}

      <Modal open={showCart} onClose={() => setShowCart(false)} title="Mon Panier">
        {cart.length === 0 ? (
          <p className="py-8 text-center text-gray-400 dark:text-gray-500">Votre panier est vide</p>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.productId} className="flex items-center gap-4 rounded-xl border border-gray-100 dark:border-gray-700 p-3">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{item.product.title}</p>
                  <p className="text-sm text-secondary">{item.product.price} coupons × {item.quantity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600">−</button>
                  <span className="w-6 text-center text-sm font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600">+</button>
                </div>
                <button onClick={() => removeFromCart(item.productId)} className="text-danger hover:text-red-700 text-sm">✕</button>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                <p className="text-xl font-bold text-secondary">{cartTotal} coupons</p>
              </div>
              <div className="text-right text-sm text-gray-400 dark:text-gray-500">
                Solde: {profile?.coupons ?? 0} coupons
                {cartTotal > (profile?.coupons ?? 0) && (
                  <p className="text-danger font-medium">Solde insuffisant</p>
                )}
              </div>
            </div>
            <Button
              className="w-full"
              disabled={cartTotal > (profile?.coupons ?? 0)}
              loading={ordering}
              onClick={handleOrder}
            >
              Confirmer la commande
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
