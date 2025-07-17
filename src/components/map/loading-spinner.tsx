export default function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 z-30">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-neutral-200 border-t-primary-600"></div>
        <p className="text-sm text-neutral-600 font-medium">Loading map...</p>
      </div>
    </div>
  );
}
