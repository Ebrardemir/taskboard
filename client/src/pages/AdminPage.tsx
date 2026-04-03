import { useEffect, useState } from 'react';
import type { User } from '../types';
import { adminApi } from '../api/admin';
import { Header } from '../components/layout/Header';
import { StatCard } from '../components/ui/StatCard';
import { Avatar } from '../components/ui/Avatar';
import { RoleBadge } from '../components/ui/Badge';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search } from 'lucide-react';

export function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;

  useEffect(() => {
    const load = async () => {
      try {
        const [u, t] = await Promise.all([adminApi.getUsers(), adminApi.getAllTasks()]);
        setUsers(u);
        setTasks(t);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const taskCountFor = (userId: number) => tasks.filter((t) => t.ownerId === userId).length;

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const adminCount = users.filter((u) => u.role === 'admin').length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Admin Paneli">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#85B7EB]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kullanıcı ara..."
            className="pl-8 pr-3 py-1.5 bg-[#F0F7FF] dark:bg-[#0D1B2E] border border-[#B5D4F4] dark:border-[#1E3A5F] rounded-lg text-[13px] text-[#0C447C] dark:text-[#E8F1FF] placeholder-[#85B7EB] outline-none focus:border-[#3B82F6] transition-colors w-52"
          />
        </div>
      </Header>

      <div className="flex-1 overflow-auto p-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-[10px] mb-5">
          <StatCard label="Toplam Kullanıcı" value={users.length} sub="kayıtlı kullanıcılar" />
          <StatCard label="Admin" value={adminCount} sub="yönetici hesaplar" valueColor="#8B5CF6" />
          <StatCard label="Toplam Görev" value={tasks.length} sub="tüm kullanıcılar" valueColor="#3B82F6" />
        </div>

        {/* Users table */}
        <div className="bg-white dark:bg-[#122040] border border-[#B5D4F4] dark:border-[#1E3A5F] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#B5D4F4] dark:border-[#1E3A5F]">
                <th className="text-left px-4 py-3 text-[12px] font-medium text-[#185FA5] dark:text-[#7BA3D4]">Kullanıcı</th>
                <th className="text-left px-4 py-3 text-[12px] font-medium text-[#185FA5] dark:text-[#7BA3D4]">E-posta</th>
                <th className="text-left px-4 py-3 text-[12px] font-medium text-[#185FA5] dark:text-[#7BA3D4]">Rol</th>
                <th className="text-left px-4 py-3 text-[12px] font-medium text-[#185FA5] dark:text-[#7BA3D4]">Görev</th>
                <th className="text-left px-4 py-3 text-[12px] font-medium text-[#185FA5] dark:text-[#7BA3D4]">Kayıt Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-[13px] text-[#85B7EB]">Yükleniyor...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-[13px] text-[#85B7EB]">Kullanıcı bulunamadı.</td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="border-b border-[#B5D4F4]/50 dark:border-[#1E3A5F]/50 hover:bg-[#F0F7FF] dark:hover:bg-[#0D1B2E]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={u.username} size={28} />
                        <span className="text-[13px] font-medium text-[#0C447C] dark:text-[#E8F1FF]">{u.username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#378ADD] dark:text-[#7BA3D4]">{u.email}</td>
                    <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                    <td className="px-4 py-3 text-[13px] text-[#0C447C] dark:text-[#E8F1FF]">{taskCountFor(u.id)}</td>
                    <td className="px-4 py-3 text-[12px] text-[#85B7EB] dark:text-[#4A6FA5]">
                      {new Date(u.created_at).toLocaleDateString('tr-TR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
