import { motion } from 'framer-motion';
import { formatCurrency } from '@/utils/formatCurrency';

export function StatCard({ title, value, icon: Icon, color, trend, trendUp }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="stat-card"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon size={26} />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold">{formatCurrency(value)}</p>
        {trend !== undefined && (
          <p className={`text-xs mt-1 font-medium ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
            {trendUp ? '↑' : '↓'} {trend}% vs last month
          </p>
        )}
      </div>
    </motion.div>
  );
}