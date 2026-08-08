import { useEffect, useState } from 'react';
import { Search, ArrowLeftRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { TransactionCard } from '@/components/transactions/TransactionCard';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { Modal } from '@/components/common/Modal';
import { Spinner } from '@/components/common/Spinner';
import { EmptyState } from '@/components/common/EmptyState';
import { transactionAPI } from '@/services/api';
import toast from 'react-hot-toast';

export function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({ type: '', category: '', search: '', page: 1 });
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const loadData = async () => {
    setLoading(true);
    try {
      const params = { ...filters, limit: 15 };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const res = await transactionAPI.getAll(params);
      setTransactions(res.data.transactions);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [filters]);

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      if (editData) {
        await transactionAPI.update(editData._id, formData);
        toast.success('Updated');
      } else {
        await transactionAPI.create(formData);
        toast.success('Added');
      }
      setShowModal(false);
      setEditData(null);
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

  return (
    <div>
      <Header title="Transactions" onAddTransaction={() => { setEditData(null); setShowModal(true); }} />

      <div className="card p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              className="input-field pl-10 py-2"
            />
          </div>
          <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })} className="input-field w-auto py-2">
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })} className="input-field w-auto py-2">
            <option value="">All Categories</option>
            {['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Rent', 'Salary', 'Freelance', 'Investment', 'Other'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : transactions.length === 0 ? (
        <EmptyState icon={ArrowLeftRight} title="No transactions found" subtitle="Add your first transaction to get started" />
      ) : (
        <div className="space-y-3">
          {transactions.map((t) => (
            <TransactionCard
              key={t._id}
              transaction={t}
              onEdit={(data) => { setEditData(data); setShowModal(true); }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {[...Array(pagination.pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setFilters({ ...filters, page: i + 1 })}
              className={`w-10 h-10 rounded-lg font-medium ${filters.page === i + 1 ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditData(null); }} title={editData ? 'Edit Transaction' : 'Add Transaction'}>
        <TransactionForm initialData={editData} onSubmit={handleSubmit} loading={saving} />
      </Modal>
    </div>
  );
}