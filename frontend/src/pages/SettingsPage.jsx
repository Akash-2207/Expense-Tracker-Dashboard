import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/services/api';
import toast from 'react-hot-toast';

export function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: { name: user?.name, currency: user?.currency, monthlyBudget: user?.monthlyBudget },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authAPI.updateProfile(data);
      updateUser(res.data);
      localStorage.setItem('token', res.data.token);
      toast.success('Settings saved');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title="Settings" />
      <div className="max-w-lg">
        <div className="card p-6">
          <h2 className="font-bold mb-6">Profile Settings</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" {...register('name')} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={user?.email} disabled className="input-field opacity-60" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              <select {...register('currency')} className="input-field">
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="INR">INR - Indian Rupee</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Monthly Budget Goal</label>
              <input type="number" step="0.01" {...register('monthlyBudget')} className="input-field" placeholder="3000" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}