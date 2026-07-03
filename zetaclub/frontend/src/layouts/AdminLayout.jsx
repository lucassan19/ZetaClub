import React from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Video, Layers, PlusCircle } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/d9a71f2c6e84b5a3/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AdminNavbar />
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Sidebar */}
        <aside className="w-full md:w-64 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                location.pathname === item.path
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
