import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Plus, Menu, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export function Header({ title, onAddTransaction }) {
  const { user } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2" onClick={() => navigate('/dashboard')}>
          <Menu size={24} />
        </button>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={toggle} className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        {onAddTransaction && (
          <button onClick={onAddTransaction} className="btn-primary">
            <Plus size={18} /> Add
          </button>
        )}
        <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}