import { useEffect, useState } from 'react';
import { getWallet, getPointsHistory } from '../../api/participant';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Spinner from '../../components/ui/Spinner';
import { HiOutlineStar } from 'react-icons/hi';
import { formatDateTime } from '../../utils/formatters';
import Badge from '../../components/ui/Badge';

export default function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [wRes, hRes] = await Promise.all([
          getWallet().catch(() => ({ data: {} })),
          getPointsHistory().catch(() => ({ data: [] })),
        ]);
        setWallet(wRes.data?.data?.wallet || wRes.data?.wallet || {});
        setHistory(hRes.data?.data?.history || hRes.data?.history || []);
      } finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <Spinner className="py-24" size="lg" />;

  const columns = [
    {
      key: 'points', label: 'Points',
      render: (r) => (
        <Badge variant={r.points >= 0 ? 'success' : 'danger'}>
          {r.points >= 0 ? '+' : ''}{r.points}
        </Badge>
      ),
    },
    { key: 'reason', label: 'Raison' },
    { key: 'createdAt', label: 'Date', render: (r) => formatDateTime(r.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Portefeuille de Points</h1>
        <p className="text-sm text-gray-500">Suivez vos gains et dépenses de points</p>
      </div>

      <Card className="bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20">
            <HiOutlineStar className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm text-white/80">Solde total</p>
            <p className="text-3xl font-bold">{wallet?.totalPoints ?? wallet?.balance ?? 0} pts</p>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader><CardTitle>Historique des points</CardTitle></CardHeader>
        <Table columns={columns} data={history} loading={false} emptyMessage="Aucun historique" />
      </Card>
    </div>
  );
}
