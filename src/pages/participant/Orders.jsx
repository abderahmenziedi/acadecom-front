import { useEffect, useState } from 'react';
import { getOrders } from '../../api/store';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import UiBadge from '../../components/ui/Badge';
import { ShoppingBag } from 'lucide-react';

const statusMap = {
  pending: { label: 'En attente', variant: 'warning' },
  confirmed: { label: 'Confirmée', variant: 'info' },
  delivered: { label: 'Livrée', variant: 'success' },
  cancelled: { label: 'Annulée', variant: 'danger' },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getOrders();
        setOrders(data.data?.orders || data.orders || []);
      } catch { }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <Spinner className="py-24" size="lg" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mes Commandes</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Historique de vos commandes dans la boutique</p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => {
            const s = statusMap[order.status] || statusMap.pending;
            return (
              <Card key={order.id}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Commande #{order.id}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-secondary">{order.totalPrice} coupons</span>
                    <UiBadge variant={s.variant}>{s.label}</UiBadge>
                  </div>
                </div>
                {order.items && order.items.length > 0 && (
                  <div className="mt-3 border-t border-gray-100 dark:border-gray-700 pt-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-1 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{item.product?.title || `Produit #${item.productId}`}</span>
                        <span className="text-gray-400 dark:text-gray-500">×{item.quantity} — {item.price * item.quantity} coupons</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p className="mt-2 text-gray-500 dark:text-gray-400">Aucune commande pour le moment.</p>
        </Card>
      )}
    </div>
  );
}
