import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { TrendLineChart } from '@/components/charts/TrendLineChart';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { Spinner } from '@/components/common/Spinner';
import { dashboardAPI } from '@/services/api';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/utils/formatCurrency';

export function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.getAnalytics()
      .then((res) => setData(res.data))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner size="lg" />;

  return (
    <div>
      <Header title="Analytics" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h2 className="font-bold mb-4">Yearly Trend</h2>
          <TrendLineChart data={data.incomeVsExpense} />
        </div>
        <div className="card p-6">
          <h2 className="font-bold mb-4">Expense by Category</h2>
          <CategoryPieChart data={data.categoryStats} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-bold mb-4">Category Breakdown</h2>
          <div className="space-y-3">
            {data.categoryStats?.map((cat) => (
              <div key={cat._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div>
                  <p className="font-medium text-sm">{cat._id}</p>
                  <p className="text-xs text-gray-500">{cat.count} transactions</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(cat.total)}</p>
                  <p className="text-xs text-gray-500">avg {formatCurrency(cat.avg)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-bold mb-4">Payment Methods</h2>
          <div className="space-y-3">
            {data.paymentStats?.map((p) => (
              <div key={p._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <span className="font-medium text-sm capitalize">{p._id}</span>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(p.total)}</p>
                  <p className="text-xs text-gray-500">{p.count} transactions</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}