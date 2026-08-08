import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getMonthName } from '@/utils/dateHelpers';

export function MonthlyBarChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-64 text-gray-400">No data yet</div>;
  }

  const months = {};
  data.forEach((item) => {
    const m = item._id.month;
    if (!months[m]) months[m] = { month: getMonthName(m), income: 0, expense: 0 };
    if (item._id.type === 'income') months[m].income = item.total;
    else months[m].expense = item.total;
  });

  const chartData = Object.values(months);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
        <Legend />
        <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} name="Income" />
        <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} name="Expense" />
      </BarChart>
    </ResponsiveContainer>
  );
}