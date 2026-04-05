const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#EF4444', '#F59E0B'];

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

interface AvatarProps {
  name: string;
  size?: number;
}

export function Avatar({ name, size = 32 }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="flex items-center justify-center rounded-full text-white font-medium select-none flex-shrink-0"
      style={{ width: size, height: size, background: getColor(name), fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}
