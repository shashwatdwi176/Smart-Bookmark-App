'use client';

interface ErrorMessageProps {
  message: string | null;
  onDismiss?: () => void;
}

export default function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg relative animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">{message}</span>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-600 dark:text-red-300 hover:text-red-800 dark:hover:text-red-100 font-bold text-xl leading-none"
            aria-label="Dismiss error"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
