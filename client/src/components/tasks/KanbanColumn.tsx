import { Plus } from 'lucide-react';
import type { Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';

const columnConfig: Record<TaskStatus, { label: string; dot: string; countBg: string; countText: string }> = {
  todo: {
    label: 'Yapılacak',
    dot: 'bg-[#3B82F6]',
    countBg: 'bg-[#E6F1FB] dark:bg-[#1A3A6B]',
    countText: 'text-[#185FA5] dark:text-[#7BA3D4]',
  },
  in_progress: {
    label: 'Devam Ediyor',
    dot: 'bg-[#F59E0B]',
    countBg: 'bg-[#FEF3C7] dark:bg-[#422006]',
    countText: 'text-[#92400E] dark:text-[#FCD34D]',
  },
  done: {
    label: 'Tamamlandı',
    dot: 'bg-[#10B981]',
    countBg: 'bg-[#D1FAE5] dark:bg-[#052E16]',
    countText: 'text-[#065F46] dark:text-[#6EE7B7]',
  },
};

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onAddTask: (status: TaskStatus) => void;
}

export function KanbanColumn({ status, tasks, onEdit, onDelete, onAddTask }: KanbanColumnProps) {
  const cfg = columnConfig[status];

  return (
    <div className="flex-1 min-w-0 bg-[#DAEEFF] dark:bg-[#122040] rounded-xl p-3 border border-[#B5D4F4] dark:border-[#1E3A5F]">
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
        <span className="text-[13px] font-medium text-[#0C447C] dark:text-[#E8F1FF] flex-1">{cfg.label}</span>
        <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${cfg.countBg} ${cfg.countText}`}>
          {tasks.length}
        </span>
      </div>

      <div className="space-y-2 min-h-[60px]">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>

      <button
        onClick={() => onAddTask(status)}
        className="mt-2 w-full border border-dashed border-[#85B7EB] dark:border-[#1E3A5F] rounded-xl py-2 text-[12px] text-[#85B7EB] dark:text-[#4A6FA5] hover:border-[#3B82F6] hover:text-[#3B82F6] transition-colors flex items-center justify-center gap-1"
      >
        <Plus size={14} />
        Görev ekle
      </button>
    </div>
  );
}
