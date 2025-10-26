import MapComponent from "@/components/map/map";
import React from "react";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations();

  return (
    <div className="w-full">
      {/* Header Section */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5">
        <h1 className="sm:text-4xl text-2xl font-bold text-neutral-900 dark:text-neutral-300">
          {t("fields.fields")}
        </h1>
      </div>

      {/* Map Section */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 overflow-hidden">
        <MapComponent />
      </div>
    </div>
  );
}
