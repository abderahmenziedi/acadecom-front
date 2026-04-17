import { useEffect, useState } from 'react';
import { getMyQuizmasters } from '../../api/brand';
import Table from '../../components/ui/Table';
import { formatDate } from '../../utils/formatters';

export default function BrandQuizmasters() {
  const [qms, setQms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getMyQuizmasters();
        setQms(data.data?.quizmasters || data.quizmasters || []);
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nom', render: (r) => r.name || '—' },
    { key: 'email', label: 'Email' },
    { key: 'createdAt', label: 'Inscrit le', render: (r) => formatDate(r.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mes Quiz Masters</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{qms.length} quiz masters associés</p>
      </div>
      <Table columns={columns} data={qms} loading={loading} emptyMessage="Aucun quiz master associé" />
    </div>
  );
}
