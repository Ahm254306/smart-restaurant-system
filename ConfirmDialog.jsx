import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Delete' }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button className="btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>
        <p className="text-sm text-ink-600">{message}</p>
      </div>
    </Modal>
  );
}
