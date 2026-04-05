import { useState } from 'react';
import type { Task, TaskStatus } from '../../types';
import { X } from 'lucide-react';

interface TaskModalProps {
  task?: Task;
  onClose: () => void;
  onSave: (data: { title: string; description: string; status: TaskStatus }) => Promise<void>;
}

export function TaskModal({ task, onClose, onSave }: TaskModalProps) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'todo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Başlık ve açıklama zorunludur.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSave({ title: title.trim(), description: description.trim(), status });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Bir hata oluştu.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-[#122040] rounded-xl border border-[#B5D4F4] dark:border-[#1E3A5F] shadow-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-medium text-[#0C447C] dark:text-[#E8F1FF]">
            {task ? 'Görevi Düzenle' : 'Yeni Görev'}
          </h2>
          <button onClick={onClose} className="text-[#85B7EB] hover:text-[#0C447C] dark:hover:text-[#E8F1FF] transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[12px] font-medium text-[#185FA5] dark:text-[#7BA3D4] mb-1">Başlık</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#F0F7FF] dark:bg-[#122040] border border-[#85B7EB] dark:border-[#1E3A5F] rounded-lg px-3 py-2 text-[13px] text-[#0C447C] dark:text-[#E8F1FF] placeholder-[#85B7EB] outline-none focus:border-[#3B82F6] transition-colors"
              placeholder="Görev başlığı"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#185FA5] dark:text-[#7BA3D4] mb-1">Açıklama</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-[#F0F7FF] dark:bg-[#122040] border border-[#85B7EB] dark:border-[#1E3A5F] rounded-lg px-3 py-2 text-[13px] text-[#0C447C] dark:text-[#E8F1FF] placeholder-[#85B7EB] outline-none focus:border-[#3B82F6] transition-colors resize-none"
              placeholder="Görev açıklaması"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#185FA5] dark:text-[#7BA3D4] mb-1">Durum</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full bg-[#F0F7FF] dark:bg-[#122040] border border-[#85B7EB] dark:border-[#1E3A5F] rounded-lg px-3 py-2 text-[13px] text-[#0C447C] dark:text-[#E8F1FF] outline-none focus:border-[#3B82F6] transition-colors"
            >
              <option value="todo">Yapılacak</option>
              <option value="in_progress">Devam Ediyor</option>
              <option value="done">Tamamlandı</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-[12px]">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#B5D4F4] dark:border-[#1E3A5F] text-[#185FA5] dark:text-[#7BA3D4] rounded-lg py-2 text-[13px] font-medium hover:bg-[#E6F1FB] dark:hover:bg-[#1A3A6B] transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#3B82F6] text-white rounded-lg py-2 text-[13px] font-medium hover:bg-blue-600 transition-colors disabled:opacity-60"
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
