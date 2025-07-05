import { Spinner } from "./spinner";

interface LoadingOverlayProps {
  isLoading: boolean;
}

export function LoadingOverlay({ isLoading }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      data-testid="loading-overlay"
    >
      <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
        <Spinner size={32} className="text-blue-600 dark:text-blue-400" />
        <p className="text-sm text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    </div>
  );
}