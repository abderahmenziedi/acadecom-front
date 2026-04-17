import Spinner from './Spinner';

export default function Table({ columns, data, loading, emptyMessage = 'Aucune donnée' }) {
  if (loading) return <Spinner className="py-12" />;

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200/60 dark:border-gray-700/50">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50/80 dark:bg-gray-800/50">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50 bg-white dark:bg-gray-800">
          {data?.length > 0 ? (
            data.map((row, i) => (
              <tr key={row.id ?? i} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-gray-400 dark:text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
