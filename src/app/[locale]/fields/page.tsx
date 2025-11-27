"use client";
import MapComponent from "@/components/map/map";
import MapControls from "@/components/map/map-controls";
import React, { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const fieldIdFromUrl = searchParams.get("fieldId");
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
    <div className="flex flex-col w-full min-h-[600px] min-w-0">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 md:gap-4 pb-4 flex-shrink-0 min-w-0">
        <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-neutral-900 dark:text-neutral-300 break-words min-w-0">
          {t("fields.fields")}
        </h1>
        {/* Map Controls - Outside the map component */}
        {handlers && (
          <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl p-3 flex-shrink-0 min-w-0">
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
      <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl shadow-soft overflow-hidden min-h-[600px] md:min-h-[700px] lg:min-h-[800px] min-w-0 w-full">
        <MapComponent
          onHandlersReady={handleHandlersReady}
          initialFieldId={fieldIdFromUrl || undefined}
        />
      </div>
    </div>
  );
}
