"use client";
import { useLoadingStore } from "@/lib/stores/loading-store";

export default function GlobalLoader() {
  const { isAppLoading, isWeatherLoading, loadingMessage } = useLoadingStore();

  // Only show loader for app initialization and weather loading
  if (!isAppLoading && !isWeatherLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/10 dark:bg-black/50 backdrop-blur-md transition-opacity duration-300">
      <div className="bg-white/90 dark:bg-neutral-800/95 backdrop-blur-xl rounded-2xl shadow-xl border border-neutral-200/50 dark:border-neutral-700/50 p-12 flex flex-col items-center w-52 mx-4 transition-all duration-300">
        {/* Elegant spinner */}
        <div className="relative w-14 h-14 mb-6">
          <div className="absolute inset-0 border-2 border-neutral-100 dark:border-neutral-700/50 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-transparent border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin"></div>
          <div
            className="absolute inset-2 border-2 border-transparent border-r-primary-500 dark:border-r-primary-500/80 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
        </div>

        {/* Loading text */}
        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium text-center tracking-wide">
          {loadingMessage || "Loading..."}
        </p>
      </div>
    </div>
  );
}
