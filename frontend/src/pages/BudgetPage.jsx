import { useEffect, useState } from 'react';
import { Target, Trash2, Plus } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Modal } from '@/components/common/Modal';
import { Spinner } from '@/components/common/Spinner';
import { EmptyState } from '@/components/common/EmptyState';
import { dashboardAPI } from '@/services/api';
import { formatCurrency } from '@/utils/formatCurrency';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const now = new Date();

  const loadData = async () => {
    try {
      const res = await dashboardAPI.getBudgets({ month: now.getMonth() + 1, year: now.getFullYear() });
      setBudgets(res.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAddBudget = async (data) => {
    setSaving(true);
    try {
      await dashboardAPI.setBudget({ ...data, month: now.getMonth() + 1, year: now.getFullYear() });
      toast.success('Budget saved');
      setShowModal(false);
      reset();
      loadData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this budget?')) return;
    try {
      await dashboardAPI.deleteBudget(id);
      toast.success('Budget deleted');
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Spinner size="lg" />;

  return (
    <div>
      <Header title="Budgets" onAddTransaction={() => setShowModal(true)} />

      {budgets.length === 0 ? (
        <EmptyState icon={Target} title="No budgets set" subtitle="Set category budgets to control your spending" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => {
            const percentage = budget.amount > 0 ? Math.min((budget.spent / budget.amount) * 100, 100) : 0;
            const isOver = budget.spent > budget.amount;

            return (
              <div key={budget._id} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">{budget.category}</h3>
                  <button onClick={() => handleDelete(budget._id)} className="text-red-400 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Spent: {formatCurrency(budget.spent)}</span>
                    <span className="text-gray-500">Budget: {formatCurrency(budget.amount)}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-red-500' : percentage > 75 ? 'bg-yellow-500' : 'bg-primary'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className={isOver ? 'text-red-500 font-medium' : 'text-gray-500'}>
                    {isOver ? `Over by ${formatCurrency(budget.spent - budget.amount)}` : `${formatCurrency(budget.remaining)} remaining`}
                  </span>
                  <span className={`font-bold ${isOver ? 'text-red-500' : 'text-primary'}`}>{Math.round(percentage)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Set Budget">
        <form onSubmit={handleSubmit(handleAddBudget)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select {...register('category', { required: 'Category required' })} className="input-field">
              <option value="">Select category</option>
              {['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Rent', 'Other'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Budget Amount</label>
            <input type="number" step="0.01" min="1" {...register('amount', { required: 'Amount required', min: 1 })} className="input-field" placeholder="500" />
            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? 'Saving...' : 'Save Budget'}
          </button>
        </form>
      </Modal>
    </div>
  );
}