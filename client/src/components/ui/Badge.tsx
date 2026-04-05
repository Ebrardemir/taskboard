import type { TaskStatus } from '../../types';

const statusConfig: Record<TaskStatus, { label: string; light: string; dark: string }> = {
  todo: {
    label: 'Yapılacak',
    light: 'bg-[#E6F1FB] text-[#185FA5]',
    dark: 'dark:bg-[#1A3A6B] dark:text-[#7BA3D4]',
  },
  in_progress: {
    label: 'Devam Ediyor',
    light: 'bg-[#FEF3C7] text-[#92400E]',
    dark: 'dark:bg-[#422006] dark:text-[#FCD34D]',
  },
  done: {
    label: 'Tamamlandı',
    light: 'bg-[#D1FAE5] text-[#065F46]',
    dark: 'dark:bg-[#052E16] dark:text-[#6EE7B7]',
  },
};

interface BadgeProps {
  status: TaskStatus;
}

export function StatusBadge({ status }: BadgeProps) {
  const cfg = statusConfig[status];
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${cfg.light} ${cfg.dark}`}>
      {cfg.label}
    </span>
  );
}

interface RoleBadgeProps {
  role: 'admin' | 'user';
}

export function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <span
      className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
        role === 'admin'
          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
          : 'bg-[#E6F1FB] text-[#185FA5] dark:bg-[#1A3A6B] dark:text-[#7BA3D4]'
      }`}
    >
      {role === 'admin' ? 'Admin' : 'Kullanıcı'}
    </span>
  );
}
