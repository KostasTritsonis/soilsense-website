import { Field } from "@/lib/types";
import { MapPin, Ruler, Navigation, X } from "lucide-react";
import { useTranslations } from "next-intl";

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
  return (
    <div className="absolute bottom-4 left-4 right-4 md:bottom-4 md:right-14 md:left-auto md:w-60 bg-white/95 dark:bg-neutral-800/90 backdrop-blur-sm rounded-3xl shadow-large border border-white/60 dark:border-neutral-700/60 p-4 md:p-6 z-10">
      <div className="flex justify-between items-center pb-4">
        <h2 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-neutral-100 truncate pr-2">
          {selectedField.label || t("common.unnamed")}
        </h2>
        <button
          onClick={onDeselect}
          className="w-8 h-8 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
        </button>
      </div>

      <div className="space-y-3 md:space-y-4 pb-4 md:pb-6">
        <div className="flex items-center gap-3 p-2 bg-neutral-50/80 dark:bg-neutral-700/80 rounded-2xl">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
              {t("fields.cropType")}
            </p>
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
              {selectedField.categories?.[0]?.type || t("common.notAvailable")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 bg-neutral-50/80 dark:bg-neutral-700/80 rounded-2xl">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <Ruler className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
              {t("fields.area")}
            </p>
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {selectedField.area.toFixed(2)} {t("units.squareMeters")}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => onGetDirections(selectedField)}
        disabled={isLoading}
        className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-400 dark:disabled:bg-neutral-600 text-white font-semibold py-3 px-4 rounded-2xl transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed shadow-soft hover:shadow-medium"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span className="text-sm md:text-base">
              {t("fields.gettingLocation")}
            </span>
          </>
        ) : (
          <>
            <Navigation className="w-4 h-4" />
            <span className="text-sm md:text-base">
              {t("fields.getDirections")}
            </span>
          </>
        )}
      </button>

      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-3 text-center">
        {hasCustomStartPoint
          ? t("fields.willUseStartPoint")
          : t("fields.usesCurrentLocation")}
      </p>
    </div>
  );
}
