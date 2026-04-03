import { useEffect, useState } from 'react';
import type { Task, TaskStatus } from '../types';
import { tasksApi } from '../api/tasks';
import { Header } from '../components/layout/Header';
import { StatusBadge } from '../components/ui/Badge';
import { TaskModal } from '../components/tasks/TaskModal';
import { Pencil, Trash2, Search } from 'lucide-react';

const STATUS_FILTERS: { value: TaskStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tümü' },
  { value: 'todo', label: 'Yapılacak' },
  { value: 'in_progress', label: 'Devam Eden' },
  { value: 'done', label: 'Tamamlandı' },
];

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const fetchTasks = async () => {
    try {
      const data = await tasksApi.getAll();
      setTasks(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, []);

  const openCreate = () => { setEditingTask(undefined); setModalOpen(true); };
  const openEdit = (task: Task) => { setEditingTask(task); setModalOpen(true); };

  const handleSave = async (data: { title: string; description: string; status: TaskStatus }) => {
    if (editingTask) {
      const updated = await tasksApi.update(editingTask.id, data);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } else {
      const created = await tasksApi.create(data);
      setTasks((prev) => [...prev, created]);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu görevi silmek istiyor musunuz?')) return;
    await tasksApi.delete(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const filtered = tasks.filter((t) => {
    if (filter !== 'all' && t.status !== filter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Görevler" showNewTask onNewTask={openCreate} />

      <div className="flex-1 overflow-auto p-5">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#85B7EB]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Görev ara..."
              className="w-full pl-8 pr-3 py-2 bg-white dark:bg-[#122040] border border-[#B5D4F4] dark:border-[#1E3A5F] rounded-lg text-[13px] text-[#0C447C] dark:text-[#E8F1FF] placeholder-[#85B7EB] outline-none focus:border-[#3B82F6] transition-colors"
            />
          </div>
          <div className="flex gap-1">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                  filter === f.value
                    ? 'bg-[#3B82F6] text-white'
                    : 'bg-white dark:bg-[#122040] border border-[#B5D4F4] dark:border-[#1E3A5F] text-[#185FA5] dark:text-[#7BA3D4] hover:border-[#3B82F6]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#122040] border border-[#B5D4F4] dark:border-[#1E3A5F] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#B5D4F4] dark:border-[#1E3A5F]">
                <th className="text-left px-4 py-3 text-[12px] font-medium text-[#185FA5] dark:text-[#7BA3D4]">Başlık</th>
                <th className="text-left px-4 py-3 text-[12px] font-medium text-[#185FA5] dark:text-[#7BA3D4]">Açıklama</th>
                <th className="text-left px-4 py-3 text-[12px] font-medium text-[#185FA5] dark:text-[#7BA3D4]">Durum</th>
                <th className="text-left px-4 py-3 text-[12px] font-medium text-[#185FA5] dark:text-[#7BA3D4]">Oluşturulma</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-[13px] text-[#85B7EB]">Yükleniyor...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-[13px] text-[#85B7EB]">Görev bulunamadı.</td>
                </tr>
              ) : (
                filtered.map((task) => (
                  <tr key={task.id} className="border-b border-[#B5D4F4]/50 dark:border-[#1E3A5F]/50 hover:bg-[#F0F7FF] dark:hover:bg-[#0D1B2E]/50 transition-colors">
                    <td className="px-4 py-3 text-[13px] font-medium text-[#0C447C] dark:text-[#E8F1FF]">{task.title}</td>
                    <td className="px-4 py-3 text-[12px] text-[#378ADD] dark:text-[#7BA3D4] max-w-xs">
                      <span className="line-clamp-1">{task.description}</span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={task.status} /></td>
                    <td className="px-4 py-3 text-[12px] text-[#85B7EB] dark:text-[#4A6FA5]">
                      {new Date(task.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(task)} className="p-1.5 rounded text-[#85B7EB] hover:text-[#3B82F6] transition-colors">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => handleDelete(task.id)} className="p-1.5 rounded text-[#85B7EB] hover:text-red-500 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
