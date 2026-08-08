import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Pencil, Trash2, CreditCard, Banknote, Smartphone, Landmark } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatRelative } from '@/utils/dateHelpers';

const paymentIcons = { cash: Banknote, card: CreditCard, upi: Smartphone, bank: Landmark, other: CreditCard };
const categoryEmojis = { Food: '🍔', Transport: '🚗', Shopping: '🛍️', Bills: '📄', Entertainment: '🎬', Health: '💊', Education: '📚', Rent: '🏠', Salary: '💼', Freelance: '💻', Investment: '📈', Business: '🏢', Gift: '🎁', Other: '📌' };

export function TransactionCard({ transaction, onEdit, onDelete }) {
  const isIncome = transaction.type === 'income';
  const PayIcon = paymentIcons[transaction.paymentMethod] || CreditCard;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4 flex items-center gap-4 hover:shadow-md transition-all group"
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${isIncome ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30'}`}>
        {categoryEmojis[transaction.category] || '📌'}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{transaction.description || transaction.category}</p>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
          <span>{transaction.category}</span>
          <span>•</span>
          <span>{formatRelative(transaction.date)}</span>
          <span>•</span>
          <PayIcon size={12} />
        </div>
      </div>

      <div className="text-right">
        <p className={`font-bold ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </p>
      </div>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(transaction)} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg text-blue-500">
          <Pencil size={16} />
        </button>
        <button onClick={() => onDelete(transaction._id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-red-500">
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
}