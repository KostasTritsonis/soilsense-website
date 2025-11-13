"use client";
import MapComponent from "@/components/map/map";
import MapControls from "@/components/map/map-controls";
import React, { useState, useCallback } from "react";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations();
  const [handlers, setHandlers] = useState<{
    handleReset: () => void;
    handleSave: () => void;
    handleLoad: () => void;
    isLoading: boolean;
    isSaving: boolean;
    hasFields: boolean;
  } | null>(null);

  const handleHandlersReady = useCallback(
    (newHandlers: {
      handleReset: () => void;
      handleSave: () => void;
      handleLoad: () => void;
      isLoading: boolean;
      isSaving: boolean;
      hasFields: boolean;
    }) => {
      setHandlers(newHandlers);
    },
    []
  );

  return (
    <div>
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4">
        <h1 className="sm:text-4xl text-2xl font-bold text-neutral-900 dark:text-neutral-300">
          {t("fields.fields")}
        </h1>
        {/* Map Controls - Outside the map component */}
        {handlers && (
          <div className=" bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm pr-4">
            <MapControls
              onReset={handlers.handleReset}
              onSave={handlers.handleSave}
              onLoad={handlers.handleLoad}
              isLoading={handlers.isLoading}
              isSaving={handlers.isSaving}
              hasFields={handlers.hasFields}
            />
          </div>
        )}
      </div>

      {/* Map Section */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft overflow-hidden">
        <MapComponent onHandlersReady={handleHandlersReady} />
      </div>
    </div>
  );
}
