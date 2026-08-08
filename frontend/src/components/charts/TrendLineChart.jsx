import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getMonthName } from '@/utils/dateHelpers';

export function TrendLineChart({ data }) {
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

  const chartData = Object.values(months).map((m) => ({
    ...m,
    savings: m.income - m.expense,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
        <Legend />
        <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} name="Income" />
        <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} name="Expense" />
        <Line type="monotone" dataKey="savings" stroke="#6366F1" strokeWidth={2} name="Savings" />
      </LineChart>
    </ResponsiveContainer>
  );
}