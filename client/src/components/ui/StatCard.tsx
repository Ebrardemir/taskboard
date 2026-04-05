interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
  valueColor?: string;
}

export function StatCard({ label, value, sub, valueColor }: StatCardProps) {
  return (
    <div className="bg-[#DAEEFF] dark:bg-[#122040] rounded-xl p-3 border border-[#B5D4F4] dark:border-[#1E3A5F]">
      <p className="text-[12px] text-[#378ADD] dark:text-[#7BA3D4]">{label}</p>
      <p
        className="text-[22px] font-medium mt-0.5 text-[#0C447C] dark:text-[#E8F1FF]"
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </p>
      {sub && <p className="text-[12px] text-[#85B7EB] dark:text-[#4A6FA5] mt-0.5">{sub}</p>}
    </div>
  );
}
