import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Target, PieChart, Settings, Wallet, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Sidebar() {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
    { path: '/budgets', label: 'Budgets', icon: Target },
    { path: '/analytics', label: 'Analytics', icon: PieChart },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-sidebar text-white min-h-screen p-6 hidden lg:flex flex-col fixed left-0 top-0 bottom-0">
      <Link to="/dashboard" className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <Wallet size={22} />
        </div>
        <span className="text-xl font-bold">ExpenseFlow</span>
      </Link>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-white/10 transition-all"
      >
        <LogOut size={20} />
        <span className="font-medium">Logout</span>
      </button>
    </aside>
  );
}