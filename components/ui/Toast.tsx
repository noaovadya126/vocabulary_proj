interface ToastProps {
  message: string;
  variant?: 'info' | 'success' | 'error';
}

const variantStyles = {
  info: 'bg-slate-900 text-white',
  success: 'bg-emerald-700 text-white',
  error: 'bg-red-700 text-white',
};

export function Toast({ message, variant = 'info' }: ToastProps) {
  return (
    <div
      role="status"
      className={`fixed top-4 right-4 z-50 max-w-sm px-4 py-3 rounded-lg shadow-lg text-sm ${variantStyles[variant]}`}
    >
      {message}
    </div>
  );
}
