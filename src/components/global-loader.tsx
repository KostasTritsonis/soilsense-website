"use client";
import { useEffect } from "react";
import { useLoadingStore } from "@/lib/stores/loading-store";
import { FullScreenLoader } from "./loader";

export default function GlobalLoader() {
  const {
    isAppLoading,
    isUserLoading,
    isFieldsLoading,
    isJobsLoading,
    isWeatherLoading,
    isMapLoading,
    loadingMessage,
    resetAllLoading,
  } = useLoadingStore();

  // Reset loading states on component unmount
  useEffect(() => {
    return () => {
      resetAllLoading();
    };
  }, [resetAllLoading]);

  // Show full screen loader for app initialization
  if (isAppLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-black/10 via-black/20 to-black/10 dark:from-black/30 dark:via-black/40 dark:to-black/30 backdrop-blur-md">
        <div className="bg-white/95 dark:bg-neutral-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 dark:border-neutral-700/60 p-12 flex flex-col items-center max-w-md mx-4">
          <FullScreenLoader text={loadingMessage} />
        </div>
      </div>
    );
  }

  // Show overlay loader for other loading states
  const isAnyLoading =
    isUserLoading ||
    isFieldsLoading ||
    isJobsLoading ||
    isWeatherLoading ||
    isMapLoading;

  if (isAnyLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-black/10 via-black/20 to-black/10 dark:from-black/30 dark:via-black/40 dark:to-black/30 backdrop-blur-md">
        <div className="bg-white/95 dark:bg-neutral-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 dark:border-neutral-700/60 p-12 flex flex-col items-center max-w-md mx-4">
          <FullScreenLoader text={loadingMessage} />
        </div>
      </div>
    );
  }

  return null;
}
