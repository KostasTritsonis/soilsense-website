"use client";
import { MapSetup } from "@/lib/map-creation";
import { useEffect, useRef } from "react";
import LoadingSpinner from "./loading-spinner";
import { useMapHandlers } from "@/lib/hooks";

export default function MapReadOnly() {
  const { mapContainer, mapRef, drawRef } = MapSetup();

  const { isLoading, handleLoad } = useMapHandlers({ mapRef, drawRef });

  // Store handleLoad in a ref to prevent dependency changes
  const handleLoadRef = useRef(handleLoad);

  // Update the ref when handleLoad changes
  useEffect(() => {
    handleLoadRef.current = handleLoad;
  }, [handleLoad]);

  // Use the ref in the effect with an empty dependency array
  useEffect(() => {
    handleLoadRef.current();
  }, []);

  return (
    <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-soft flex relative justify-center items-center w-full min-w-0 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[730px] overflow-hidden">
      {isLoading && <LoadingSpinner />}
      <div
        ref={mapContainer}
        className="w-full h-full rounded-xl sm:rounded-2xl min-w-0"
      />
    </div>
  );
}
