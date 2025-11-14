"use client";
import { MapPin, ZoomIn, Ruler, LucideIcon, Info, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

type InfoRowProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
};

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-neutral-50/80 dark:bg-neutral-700/80 rounded-lg sm:rounded-xl">
      <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
      <span className="text-[10px] sm:text-xs md:text-sm text-neutral-600 dark:text-neutral-400 font-medium truncate">
        {label}
      </span>
      <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-neutral-900 dark:text-neutral-300 flex-1 text-right truncate">
        {value}
      </span>
    </div>
  );
}

type InfoPanelProps = {
  lng: number;
  lat: number;
  zoom: number;
  fieldArea: number;
};

export default function InfoPanel({
  lng,
  lat,
  zoom,
  fieldArea,
}: InfoPanelProps) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Toggle Button - Only visible on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden w-8 h-8 bg-white/95 dark:bg-neutral-800/90 backdrop-blur-sm border border-white/60 dark:border-neutral-700/60 rounded-lg flex items-center justify-center shadow-soft hover:shadow-medium transition-all z-20"
        aria-label={isOpen ? t("common.close") : t("common.info")}
      >
        {isOpen ? (
          <X className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
        ) : (
          <Info className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
        )}
      </button>

      {/* Info Panel Content */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } sm:block absolute bottom-0 right-full mr-2 sm:mr-0 sm:relative sm:bottom-auto sm:right-auto`}
      >
        <div className="p-2 sm:p-2.5 md:p-3 bg-white/95 dark:bg-neutral-800/90 backdrop-blur-sm border border-white/60 dark:border-neutral-700/60 rounded-xl sm:rounded-2xl shadow-large sm:shadow-none max-w-[calc(100vw-6rem)] sm:max-w-none">
          <div className="space-y-1.5 sm:space-y-2">
            <InfoRow
              icon={MapPin}
              label={t("fields.longitude")}
              value={lng.toFixed(4)}
            />

            <InfoRow
              icon={MapPin}
              label={t("fields.latitude")}
              value={lat.toFixed(4)}
            />

            <InfoRow
              icon={ZoomIn}
              label={t("fields.zoom")}
              value={zoom.toFixed(2)}
            />

            <InfoRow
              icon={Ruler}
              label={t("fields.area")}
              value={`${fieldArea.toFixed(2)} ${t("units.squareMeters")}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
