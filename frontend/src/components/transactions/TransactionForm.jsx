import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Button } from '@/components/common/Button';

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Rent', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other'];
const PAYMENT_METHODS = ['cash', 'card', 'upi', 'bank', 'other'];

export function TransactionForm({ initialData, onSubmit, loading }) {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: initialData || { type: 'expense', paymentMethod: 'cash', date: new Date().toISOString().split('T')[0] },
  });

  const type = watch('type');
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useEffect(() => {
    if (initialData) {
      reset({ ...initialData, date: initialData.date?.split('T')[0] });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <label className={`flex items-center justify-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-all ${type === 'expense' ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600' : 'border-gray-200 dark:border-gray-700'}`}>
          <input type="radio" value="expense" {...register('type')} className="hidden" />
          <span className="font-medium text-sm">Expense</span>
        </label>
        <label className={`flex items-center justify-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-all ${type === 'income' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600' : 'border-gray-200 dark:border-gray-700'}`}>
          <input type="radio" value="income" {...register('type')} className="hidden" />
          <span className="font-medium text-sm">Income</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Amount *</label>
        <input type="number" step="0.01" min="0.01" {...register('amount', { required: 'Amount is required', min: 0.01 })} className="input-field" placeholder="0.00" />
        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category *</label>
        <select {...register('category', { required: 'Category is required' })} className="input-field">
          <option value="">Select category</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <input type="text" {...register('description')} className="input-field" placeholder="What was this for?" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date *</label>
          <input type="date" {...register('date', { required: 'Date is required' })} className="input-field" />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Payment</label>
          <select {...register('paymentMethod')} className="input-field">
            {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
          </select>
        </div>
      </div>

      <Button type="submit" loading={loading} className="w-full">
        {initialData ? 'Update Transaction' : 'Add Transaction'}
      </Button>
    </form>
  );
}