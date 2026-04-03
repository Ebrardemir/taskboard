import { Moon, Sun, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  title: string;
  onNewTask?: () => void;
  showNewTask?: boolean;
  children?: React.ReactNode;
}

export function Header({ title, onNewTask, showNewTask = false, children }: HeaderProps) {
  const { dark, toggle } = useTheme();

  return (
    <div className="h-14 flex items-center justify-between px-6 bg-white dark:bg-[#122040] border-b border-[#B5D4F4] dark:border-[#1E3A5F] flex-shrink-0">
      <h1 className="text-[15px] font-medium text-[#0C447C] dark:text-[#E8F1FF]">{title}</h1>

      <div className="flex items-center gap-2">
        {children}
        <button
          onClick={toggle}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#85B7EB] hover:text-[#0C447C] dark:hover:text-[#E8F1FF] hover:bg-[#E6F1FB] dark:hover:bg-[#1A3A6B] transition-colors"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {showNewTask && (
          <button
            onClick={onNewTask}
            className="flex items-center gap-1.5 bg-[#3B82F6] text-white rounded-lg px-3 py-1.5 text-[13px] font-medium hover:bg-blue-600 transition-colors"
          >
            <Plus size={14} />
            Yeni Görev
          </button>
        )}
      </div>
    </div>
  );
}
