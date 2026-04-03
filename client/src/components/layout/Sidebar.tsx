import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks', icon: CheckSquare, label: 'Görevler' },
];

export function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <div className="w-[210px] flex-shrink-0 h-screen bg-[#E6F1FB] dark:bg-[#0F2447] border-r border-[#B5D4F4] dark:border-[#1A3A6B] flex flex-col">
      {/* Logo */}
      <div className="px-4 py-4 flex items-center gap-2.5 border-b border-[#B5D4F4] dark:border-[#1A3A6B]">
        <div className="w-8 h-8 rounded-lg bg-[#3B82F6] flex items-center justify-center">
          <CheckSquare size={16} className="text-white" />
        </div>
        <span className="text-[15px] font-medium text-[#0C447C] dark:text-[#E8F1FF]">TaskBoard</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        <p className="text-[11px] font-normal text-[#378ADD] dark:text-[#4A6FA5] px-2 py-1 uppercase tracking-wide">
          Menü
        </p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2 py-2 rounded-lg mx-1 text-[13px] transition-colors ${
                isActive
                  ? 'bg-[#B5D4F4] dark:bg-[#1A3A6B] text-[#042C53] dark:text-[#E8F1FF] font-medium'
                  : 'text-[#185FA5] dark:text-[#7BA3D4] hover:bg-[#B5D4F4]/50 dark:hover:bg-[#1A3A6B]/50'
              }`
            }
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <>
            <p className="text-[11px] font-normal text-[#378ADD] dark:text-[#4A6FA5] px-2 pt-3 pb-1 uppercase tracking-wide">
              Yönetim
            </p>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2 py-2 rounded-lg mx-1 text-[13px] transition-colors ${
                  isActive
                    ? 'bg-[#B5D4F4] dark:bg-[#1A3A6B] text-[#042C53] dark:text-[#E8F1FF] font-medium'
                    : 'text-[#185FA5] dark:text-[#7BA3D4] hover:bg-[#B5D4F4]/50 dark:hover:bg-[#1A3A6B]/50'
                }`
              }
            >
              <ShieldCheck size={15} />
              Admin Panel
            </NavLink>
          </>
        )}
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-[#B5D4F4] dark:border-[#1A3A6B] flex items-center gap-2">
        <Avatar name={user?.username ?? 'U'} size={28} />
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-medium text-[#0C447C] dark:text-[#E8F1FF] truncate">{user?.username}</p>
          <p className="text-[11px] text-[#85B7EB] dark:text-[#4A6FA5] truncate">{user?.role}</p>
        </div>
        <button
          onClick={logout}
          title="Çıkış yap"
          className="text-[#85B7EB] hover:text-red-500 transition-colors"
        >
          <LogOut size={14} />
        </button>
      </div>
    </div>
  );
}
