import { Pencil, Trash2 } from 'lucide-react';
import type { Task } from '../../types';
import { StatusBadge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '../../context/AuthContext';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const { user } = useAuth();

  return (
    <div className="bg-white dark:bg-[#0D1B2E] border border-[#B5D4F4] dark:border-[#1E3A5F] rounded-xl p-3 group">
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3 className="text-[13px] font-medium text-[#0C447C] dark:text-[#E8F1FF] leading-snug flex-1">
          {task.title}
        </h3>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1 rounded text-[#85B7EB] hover:text-[#3B82F6] transition-colors"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 rounded text-[#85B7EB] hover:text-red-500 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <p className="text-[12px] text-[#378ADD] dark:text-[#7BA3D4] leading-snug mb-2 line-clamp-2">
        {task.description}
      </p>

      <div className="flex items-center justify-between">
        <StatusBadge status={task.status} />
        <Avatar name={user?.username ?? 'U'} size={22} />
      </div>
    </div>
  );
}
