'use client';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'warning' }) {
  if (!isOpen) return null;

  const typeStyles = {
    warning: {
      icon: '⚠️',
      iconBg: '#fef3c7',
      iconColor: '#f59e0b',
      buttonBg: '#ef4444',
      buttonHover: '#dc2626',
    },
    danger: {
      icon: '🗑️',
      iconBg: '#fee2e2',
      iconColor: '#ef4444',
      buttonBg: '#ef4444',
      buttonHover: '#dc2626',
    },
    info: {
      icon: 'ℹ️',
      iconBg: '#dbeafe',
      iconColor: '#3b82f6',
      buttonBg: '#3b82f6',
      buttonHover: '#2563eb',
    },
  };

  const styles = typeStyles[type] || typeStyles.warning;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div 
            className="modal-icon"
            style={{
              backgroundColor: styles.iconBg,
              color: styles.iconColor,
            }}
          >
            {styles.icon}
          </div>
          <h3 className="modal-title">{title}</h3>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button
            className="modal-btn modal-btn-cancel"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            className="modal-btn modal-btn-confirm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{
              backgroundColor: styles.buttonBg,
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = styles.buttonHover;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = styles.buttonBg;
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

