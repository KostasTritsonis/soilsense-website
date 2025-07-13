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
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl shadow-green-100/40 p-8 flex flex-col items-center">
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
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl shadow-green-100/40 p-8 flex flex-col items-center">
          <FullScreenLoader text={loadingMessage} />
        </div>
      </div>
    );
  }

  return null;
}
