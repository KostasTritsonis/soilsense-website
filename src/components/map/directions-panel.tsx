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
    <div className="absolute top-4 left-4 right-4 md:top-4 md:right-14 md:left-auto w-auto md:w-72 bg-white/95 backdrop-blur-sm rounded-2xl shadow-large border border-white/60 z-50">
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-neutral-900">
            {t("fields.directions")}
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 bg-neutral-100 hover:bg-neutral-200 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 text-neutral-600" />
          </button>
        </div>

        {/* Destination */}
        <div className="flex items-center gap-2 p-3 bg-neutral-50/80 rounded-xl mb-4">
          <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-neutral-600 font-medium">
              {t("fields.destination")}
            </p>
            <p className="text-sm font-semibold text-neutral-900 truncate">
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
          className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-400 text-white py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors shadow-soft hover:shadow-medium disabled:cursor-not-allowed"
        >
          <ExternalLink className="w-4 h-4" />
          {t("fields.openInMaps")}
        </button>
      </div>
    </div>
  );
}
