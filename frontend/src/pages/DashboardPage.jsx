import { useEffect, useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { MonthlyBarChart } from '@/components/charts/MonthlyBarChart';
import { TransactionCard } from '@/components/transactions/TransactionCard';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { Modal } from '@/components/common/Modal';
import { Spinner } from '@/components/common/Spinner';
import { dashboardAPI, transactionAPI } from '@/services/api';
import toast from 'react-hot-toast';

export function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const res = await dashboardAPI.getData();
      setData(res.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAddTransaction = async (formData) => {
    setSaving(true);
    try {
      await transactionAPI.create(formData);
      toast.success('Transaction added');
      setShowModal(false);
      loadData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this transaction?')) return;
    try {
      await transactionAPI.delete(id);
      toast.success('Deleted');
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Spinner size="lg" />;

  return (
    <div>
      <Header title="Dashboard" onAddTransaction={() => setShowModal(true)} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Balance" value={data.balance} icon={Wallet} color="bg-blue-50 text-blue-600 dark:bg-blue-900/30" />
        <StatCard title="Monthly Income" value={data.monthIncome} icon={TrendingUp} color="bg-green-50 text-green-600 dark:bg-green-900/30" />
        <StatCard title="Monthly Expense" value={data.monthExpense} icon={TrendingDown} color="bg-red-50 text-red-600 dark:bg-red-900/30" />
        <StatCard title="Monthly Savings" value={data.monthBalance} icon={PiggyBank} color="bg-purple-50 text-purple-600 dark:bg-purple-900/30" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h2 className="font-bold mb-4">Spending by Category</h2>
          <CategoryPieChart data={data.categoryBreakdown} />
        </div>
        <div className="card p-6">
          <h2 className="font-bold mb-4">Income vs Expense (6 Months)</h2>
          <MonthlyBarChart data={data.monthlyTrend} />
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-bold mb-4">Recent Transactions</h2>
        <div className="space-y-3">
          {data.recentTransactions?.map((t) => (
            <TransactionCard key={t._id} transaction={t} onDelete={handleDelete} onEdit={() => {}} />
          ))}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Transaction">
        <TransactionForm onSubmit={handleAddTransaction} loading={saving} />
      </Modal>
    </div>
  );
}