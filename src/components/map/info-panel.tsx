"use client";
import {
  LocationOn,
  ZoomIn,
  Straighten,
  Info,
  Close,
} from "@mui/icons-material";
import { SvgIconComponent } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { useState } from "react";

type InfoRowProps = {
  icon: SvgIconComponent;
  label: string;
  value: string | number;
};

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-neutral-50/80 dark:bg-neutral-700/80 rounded-lg sm:rounded-xl">
      <Icon
        className="text-neutral-500 dark:text-neutral-400 flex-shrink-0 text-sm sm:text-base"
        fontSize="small"
      />
      <span className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-medium truncate">
        {label}
      </span>
      <span className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-300 flex-1 text-right truncate">
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
        className="sm:hidden w-9 h-9 bg-white/95 dark:bg-neutral-800/90 backdrop-blur-sm border border-white/60 dark:border-neutral-700/60 rounded-lg flex items-center justify-center shadow-soft hover:shadow-medium transition-all z-20"
        aria-label={isOpen ? t("common.close") : t("common.info")}
      >
        {isOpen ? (
          <Close
            className="text-neutral-600 dark:text-neutral-400 text-xl"
            fontSize="small"
          />
        ) : (
          <Info
            className="text-neutral-600 dark:text-neutral-400 text-xl"
            fontSize="small"
          />
        )}
      </button>

      {/* Info Panel Content */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } sm:block absolute bottom-0 right-full mr-2 sm:mr-0 sm:relative sm:bottom-auto sm:right-auto z-30`}
      >
        <div className="p-2.5 sm:p-3 bg-white/95 dark:bg-neutral-800/90 backdrop-blur-sm border border-white/60 dark:border-neutral-700/60 rounded-lg sm:rounded-xl md:rounded-2xl shadow-large sm:shadow-none max-w-[calc(100vw-5rem)] sm:max-w-none">
          <div className="space-y-1.5 sm:space-y-2">
            <InfoRow
              icon={LocationOn}
              label={t("fields.longitude")}
              value={lng.toFixed(4)}
            />

            <InfoRow
              icon={LocationOn}
              label={t("fields.latitude")}
              value={lat.toFixed(4)}
            />

            <InfoRow
              icon={ZoomIn}
              label={t("fields.zoom")}
              value={zoom.toFixed(2)}
            />

            <InfoRow
              icon={Straighten}
              label={t("fields.area")}
              value={`${fieldArea.toFixed(2)} ${t("units.squareMeters")}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
