import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 animate-fade-in bg-ink-900/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative flex max-h-[92vh] w-full animate-pop flex-col rounded-t-3xl bg-white shadow-pop sm:rounded-3xl ${widths[size]}`}
      >
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4 sm:px-6">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-ink-100 px-5 py-4 sm:px-6">{footer}</div>}
      </div>
    </div>
  );
}
