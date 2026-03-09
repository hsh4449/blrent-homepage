import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Car, MessageSquare, LogOut, Menu, X } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import AdminLogin from './AdminLogin';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: '대시보드', end: true },
  { to: '/admin/vehicles', icon: Car, label: '차량 관리' },
  { to: '/admin/consultations', icon: MessageSquare, label: '상담 관리' },
];

export default function AdminLayout() {
  const { isAdmin, logout } = useAdmin();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAdmin) {
    return <AdminLogin />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-bg-main flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col
          glass border-r border-white/[0.08] bg-bg-main/95
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.08]">
          <h1 className="text-xl font-bold text-white">
            BL<span className="text-accent">렌트카</span>
            <span className="text-text-secondary text-sm font-normal ml-2">Admin</span>
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-text-secondary hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/[0.08]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-red-400 hover:bg-white/5 transition-colors"
          >
            <LogOut size={20} />
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar (mobile) */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/[0.08]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-text-secondary hover:text-white transition-colors"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-bold text-white">
            BL<span className="text-accent">렌트카</span>
            <span className="text-text-secondary text-sm font-normal ml-2">Admin</span>
          </h1>
          <div className="w-6" />
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
