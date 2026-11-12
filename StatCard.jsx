export default function StatCard({ label, value, icon: Icon, tone = 'brand', hint }) {
  const tones = {
    brand: 'bg-brand-100 text-brand-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    sky: 'bg-sky-100 text-sky-600',
    violet: 'bg-violet-100 text-violet-600',
    rose: 'bg-rose-100 text-rose-600',
  };
  return (
    <div className="card animate-slide-up p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-ink-500">{label}</p>
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-[18px] w-[18px]" />
        </div>
      </div>
      <p className="mt-3 break-words text-2xl font-extrabold leading-tight tracking-tight text-ink-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}
