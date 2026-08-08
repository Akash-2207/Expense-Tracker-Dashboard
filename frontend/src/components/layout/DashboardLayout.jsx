import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Toaster } from 'react-hot-toast';

export function DashboardLayout() {
  return (
    <div className="min-h-screen">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Sidebar />
      <main className="lg:ml-64 p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}