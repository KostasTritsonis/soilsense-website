"use client";
import { X, MapPin, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

interface DirectionsPanelProps {
  onClose: () => void;
  startPoint: [number, number] | null;
  destination: string;
  destinationCoordinates?: [number, number];
}

export default function DirectionsPanel({
  onClose,
  startPoint,
  destination,
  destinationCoordinates,
}: DirectionsPanelProps) {
  const t = useTranslations();

  const formatCoordinates = (coordinates: [number, number]): string => {
    const [lat, lng] = coordinates;
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  const handleOpenMaps = () => {
    if (!startPoint || !destinationCoordinates) return;

    const url = `https://www.google.com/maps/dir/${startPoint[1]},${startPoint[0]}/${destinationCoordinates[1]},${destinationCoordinates[0]}`;
    window.open(url, "_blank");
  };

  return (
    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 md:top-4 md:right-14 md:left-auto w-auto md:w-72 bg-white/95 dark:bg-neutral-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-large border border-white/60 dark:border-neutral-700/60 z-[100]">
      <div className="p-3 sm:p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100">
            {t("fields.directions")}
          </h3>
          <button
            onClick={onClose}
            className="w-6 h-6 sm:w-7 sm:h-7 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        {/* Destination */}
        <div className="flex items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3 bg-neutral-50/80 dark:bg-neutral-700/80 rounded-lg sm:rounded-xl mb-3 sm:mb-4">
          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400 font-medium">
              {t("fields.destination")}
            </p>
            <p className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
              {destinationCoordinates
                ? formatCoordinates(destinationCoordinates)
                : destination}
            </p>
          </div>
        </div>

        {/* Open in Maps Button */}
        <button
          onClick={handleOpenMaps}
          disabled={!startPoint || !destinationCoordinates}
          className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-400 dark:disabled:bg-neutral-600 text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-soft hover:shadow-medium disabled:cursor-not-allowed"
        >
          <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          {t("fields.openInMaps")}
        </button>
      </div>
    </div>
  );
}
