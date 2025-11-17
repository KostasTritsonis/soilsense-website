import { Field } from "@/lib/types";
import {
  MapPin,
  Ruler,
  Navigation,
  X,
  Share2,
  ChevronDown,
  Globe,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { centroid } from "@turf/turf";
import toast from "react-hot-toast";

type FieldInfoPanelProps = {
  selectedField: Field;
  onGetDirections: (field: Field) => void;
  onDeselect: () => void;
  isLoading?: boolean;
  hasCustomStartPoint?: boolean;
};

export default function FieldInfoPanel({
  selectedField,
  onGetDirections,
  onDeselect,
  isLoading = false,
  hasCustomStartPoint = false,
}: FieldInfoPanelProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [isSharing, setIsSharing] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target as Node)
      ) {
        setShowShareMenu(false);
      }
    };

    if (showShareMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showShareMenu]);

  const handleShareLocation = async () => {
    setIsSharing(true);
    setShowShareMenu(false);
    try {
      // Calculate field center coordinates
      const fieldPolygon = {
        type: "Polygon",
        coordinates: selectedField.coordinates,
      } as const;
      const center = centroid(fieldPolygon);
      const [lng, lat] = center.geometry.coordinates as [number, number];

      // Generate Google Maps link
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      const shareText = t("fields.shareLocationText");
      const shareMessage = `${shareText}\n\n🗺️ ${mapsUrl}`;

      const shareData = {
        title: t("fields.shareLocation"),
        text: shareMessage,
        url: mapsUrl,
      };

      // Try Web Share API first
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        try {
          await navigator.share(shareData);
          return;
        } catch (error) {
          if (error instanceof Error && error.name !== "AbortError") {
            console.error("Error sharing:", error);
          }
        }
      }

      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareMessage);
        toast.success(t("fields.linkCopied"));
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        window.open(mapsUrl, "_blank");
      }
    } catch (error) {
      console.error("Error sharing location:", error);
      toast.error(t("errors.general"));
    } finally {
      setIsSharing(false);
    }
  };

  const handleShareField = async () => {
    setIsSharing(true);
    setShowShareMenu(false);
    try {
      // Calculate field center coordinates
      const fieldPolygon = {
        type: "Polygon",
        coordinates: selectedField.coordinates,
      } as const;
      const center = centroid(fieldPolygon);
      const [lng, lat] = center.geometry.coordinates as [number, number];

      // Prepare field information
      const fieldName = selectedField.label || t("common.unnamed");
      const cropType =
        selectedField.categories?.[0]?.type || t("common.notAvailable");
      const area = selectedField.area.toFixed(2);

      // Generate app deep link URL with additional parameters
      const baseUrl =
        typeof window !== "undefined" ? window.location.origin : "";
      const urlParams = new URLSearchParams({
        fieldId: selectedField.id,
        name: encodeURIComponent(fieldName),
        cropType: encodeURIComponent(cropType),
        area: area,
        lat: lat.toFixed(6),
        lng: lng.toFixed(6),
      });

      // Optionally include coordinates as JSON (for sharing with users who don't have the field)
      // Encode coordinates as base64 to keep URL shorter
      try {
        const coordsJson = JSON.stringify(selectedField.coordinates);
        const coordsBase64 = btoa(coordsJson);
        urlParams.set("coords", coordsBase64);
      } catch (error) {
        console.error("Failed to encode coordinates:", error);
      }

      const appUrl = `${baseUrl}/${locale}/fields?${urlParams.toString()}`;

      // Generate Google Maps link
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      const shareText = t("fields.shareText", { fieldName });

      // Create detailed share message with field information
      const shareMessage = `${shareText}\n\n🌾 ${t(
        "fields.cropType"
      )}: ${cropType}\n📏 ${t("fields.area")}: ${area} ${t(
        "units.squareMeters"
      )}\n📍 ${t("fields.location")}: ${lat.toFixed(4)}, ${lng.toFixed(
        4
      )}\n\n🔗 Open in app: ${appUrl}\n🗺️ View on map: ${mapsUrl}`;

      const shareData = {
        title: t("fields.shareFieldLocation"),
        text: shareMessage,
        url: appUrl,
      };

      // Try Web Share API first (works on mobile and some desktop browsers)
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        try {
          await navigator.share(shareData);
          return;
        } catch (error) {
          // User cancelled or error occurred, fall through to clipboard
          if (error instanceof Error && error.name !== "AbortError") {
            console.error("Error sharing:", error);
          }
        }
      }

      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareMessage);
        toast.success(t("fields.linkCopied"));
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        // Last resort: open a new window with the app URL
        window.open(appUrl, "_blank");
      }
    } catch (error) {
      console.error("Error sharing field:", error);
      toast.error(t("errors.general"));
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 md:bottom-4 md:right-14 md:left-auto md:w-60 bg-white/95 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-large border border-white/60 dark:border-neutral-700/60 p-3 sm:p-4 md:p-6 z-10 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center pb-3 sm:pb-4">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-neutral-900 dark:text-neutral-100 truncate pr-2">
          {selectedField.label || t("common.unnamed")}
        </h2>
        <button
          onClick={onDeselect}
          className="w-7 h-7 sm:w-8 sm:h-8 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
        >
          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-600 dark:text-neutral-400" />
        </button>
      </div>

      <div className="space-y-2 sm:space-y-3 md:space-y-4 pb-3 sm:pb-4 md:pb-6">
        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 bg-neutral-50/80 dark:bg-neutral-700/80 rounded-xl sm:rounded-2xl">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 dark:bg-green-900/30 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400 font-medium">
              {t("fields.cropType")}
            </p>
            <p className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
              {selectedField.categories?.[0]?.type || t("common.notAvailable")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 bg-neutral-50/80 dark:bg-neutral-700/80 rounded-xl sm:rounded-2xl">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <Ruler className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400 font-medium">
              {t("fields.area")}
            </p>
            <p className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {selectedField.area.toFixed(2)} {t("units.squareMeters")}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:gap-3">
        <button
          onClick={() => onGetDirections(selectedField)}
          disabled={isLoading}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-400 dark:disabled:bg-neutral-600 text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed shadow-soft hover:shadow-medium text-xs sm:text-sm md:text-base"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 border-2 border-white border-t-transparent"></div>
              <span>{t("fields.gettingLocation")}</span>
            </>
          ) : (
            <>
              <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{t("fields.getDirections")}</span>
            </>
          )}
        </button>

        <div className="relative" ref={shareMenuRef}>
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            disabled={isSharing}
            className="w-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl sm:rounded-2xl transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed shadow-soft hover:shadow-medium text-xs sm:text-sm md:text-base"
          >
            {isSharing ? (
              <>
                <div className="animate-spin rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 border-2 border-neutral-600 dark:border-neutral-400 border-t-transparent"></div>
                <span>{t("fields.sharing")}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{t("fields.shareField")}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${
                    showShareMenu ? "rotate-180" : ""
                  }`}
                />
              </>
            )}
          </button>

          {showShareMenu && !isSharing && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm border border-white/60 dark:border-neutral-700/60 rounded-xl sm:rounded-2xl shadow-large overflow-hidden z-20">
              <button
                onClick={handleShareLocation}
                className="w-full px-4 py-3 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-colors flex items-start gap-3"
              >
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {t("fields.shareLocation")}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {t("fields.shareLocationDescription")}
                  </p>
                </div>
              </button>
              <div className="border-t border-neutral-200 dark:border-neutral-700"></div>
              <button
                onClick={handleShareField}
                className="w-full px-4 py-3 text-left hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-colors flex items-start gap-3"
              >
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Share2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {t("fields.shareField")}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {t("fields.shareFieldDescription")}
                  </p>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-2 sm:mt-3 text-center">
        {hasCustomStartPoint
          ? t("fields.willUseStartPoint")
          : t("fields.usesCurrentLocation")}
      </p>
    </div>
  );
}
