const styles = {
  Pending: 'bg-amber-100 text-amber-800 ring-amber-200',
  Confirmed: 'bg-sky-100 text-sky-800 ring-sky-200',
  Preparing: 'bg-violet-100 text-violet-800 ring-violet-200',
  'Out for Delivery': 'bg-indigo-100 text-indigo-800 ring-indigo-200',
  Completed: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  Cancelled: 'bg-red-100 text-red-800 ring-red-200',
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
        styles[status] || 'bg-ink-100 text-ink-700 ring-ink-200'
      }`}
    >
      {status}
    </span>
  );
}
