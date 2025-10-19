export default function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 z-30">
      <div className="flex flex-col items-center gap-6">
        {/* Enhanced spinner with gradient and glow */}
        <div className="relative">
          {/* Outer glow */}
          <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full blur-md opacity-20 animate-pulse"></div>
          {/* Main spinner */}
          <div className="relative w-16 h-16 border-4 border-neutral-200 rounded-full">
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary-600 rounded-full animate-spin"></div>
            <div
              className="absolute inset-2 w-12 h-12 border-2 border-transparent border-b-primary-500 rounded-full animate-spin"
              style={{
                animationDirection: "reverse",
                animationDuration: "0.8s",
              }}
            ></div>
          </div>
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Loading text with enhanced styling */}
        <div className="text-center space-y-2">
          <p className="text-base text-neutral-700 font-semibold animate-pulse">
            Loading map...
          </p>
          <div className="flex items-center justify-center gap-1">
            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce"></div>
            <div
              className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
