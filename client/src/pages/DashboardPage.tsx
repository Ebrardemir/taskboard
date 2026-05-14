import { useEffect, useState } from 'react';
import type { Task, TaskStatus } from '../types';
import { tasksApi } from '../api/tasks';
import { Header } from '../components/layout/Header';
import { StatCard } from '../components/ui/StatCard';
import { KanbanColumn } from '../components/tasks/KanbanColumn';
import { TaskModal } from '../components/tasks/TaskModal';

export function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');

  useEffect(() => {
    tasksApi
      .getAll()
      .then((data) => {
        setTasks(data);
      })
      .catch(() => {
        /* API hatası - intentionally empty */
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const openCreate = (status: TaskStatus = 'todo') => {
    setEditingTask(undefined);
    setDefaultStatus(status);
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSave = async (data: { title: string; description: string; status: TaskStatus }) => {
    if (editingTask) {
      const updated = await tasksApi.update(editingTask.id, data);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } else {
      const created = await tasksApi.create({ ...data, status: data.status || defaultStatus });
      setTasks((prev) => [...prev, created]);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu görevi silmek istediğinize emin misiniz?')) return;
    await tasksApi.delete(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const byStatus = (status: TaskStatus) => tasks.filter((t) => t.status === status);

  const inProgress = byStatus('in_progress');
  const done = byStatus('done');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Dashboard" showNewTask onNewTask={() => openCreate()} />

      <div className="flex-1 overflow-auto p-5">
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-[10px] mb-5">
          <StatCard label="Toplam Görev" value={tasks.length} sub="tüm görevler" />
          <StatCard label="Devam Eden" value={inProgress.length} sub="aktif görevler" valueColor="#F59E0B" />
          <StatCard label="Tamamlanan" value={done.length} sub="biten görevler" valueColor="#10B981" />
        </div>

        {/* Kanban */}
        {loading ? (
          <div className="flex items-center justify-center h-40 text-[#85B7EB] text-[13px]">Yükleniyor...</div>
        ) : (
          <div className="flex gap-3 h-[calc(100vh-260px)] overflow-x-auto">
            {(['todo', 'in_progress', 'done'] as TaskStatus[]).map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={byStatus(status)}
                onEdit={openEdit}
                onDelete={handleDelete}
                onAddTask={openCreate}
              />
            ))}
          </div>
        )}
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
