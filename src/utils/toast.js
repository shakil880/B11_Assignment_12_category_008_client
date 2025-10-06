// Simple toast notification utility
class Toast {
  static show(message, type = 'info') {
    // Calculate position for stacking multiple toasts
    const existingToasts = document.querySelectorAll('.toast');
    const bottomOffset = 20 + (existingToasts.length * 80); // Stack toasts with 80px spacing

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Style the toast
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: `${bottomOffset}px`,
      right: '20px',
      padding: '12px 24px',
      borderRadius: '8px',
      color: 'white',
      fontSize: '14px',
      fontWeight: '500',
      zIndex: '9999',
      maxWidth: '400px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      animation: 'slideInRight 0.3s ease-out',
      cursor: 'pointer',
      transition: 'bottom 0.3s ease-out'
    });

    // Set background color based on type
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };
    toast.style.backgroundColor = colors[type] || colors.info;

    // Add to document
    document.body.appendChild(toast);

    // Remove on click
    toast.addEventListener('click', () => {
      toast.remove();
      Toast.repositionToasts();
    });

    // Auto remove after 4 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
          toast.remove();
          Toast.repositionToasts();
        }, 300);
      }
    }, 4000);
  }

  static repositionToasts() {
    const toasts = document.querySelectorAll('.toast');
    toasts.forEach((toast, index) => {
      const bottomOffset = 20 + (index * 80);
      toast.style.bottom = `${bottomOffset}px`;
    });
  }

  static success(message) {
    this.show(message, 'success');
  }

  static error(message) {
    this.show(message, 'error');
  }

  static warning(message) {
    this.show(message, 'warning');
  }

  static info(message) {
    this.show(message, 'info');
  }
}

// Add CSS animations to document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%) translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateX(0) translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0) translateY(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%) translateY(20px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

export default Toast;