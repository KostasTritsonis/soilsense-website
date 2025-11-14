export default function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm rounded-xl sm:rounded-2xl md:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 z-30">
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        {/* Simple elegant spinner */}
        <div className="relative w-10 h-10 sm:w-12 sm:h-12">
          <div className="absolute inset-0 border-2 sm:border-4 border-neutral-200 dark:border-neutral-700 rounded-full"></div>
          <div className="absolute inset-0 border-2 sm:border-4 border-transparent border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin"></div>
        </div>

        {/* Loading text */}
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-medium">
          Loading map...
        </p>
      </div>
    </div>
  );
}
