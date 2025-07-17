import { Field } from "@/lib/types";
import { MapPin, Ruler, Navigation, X } from "lucide-react";

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
  return (
    <div className="absolute bottom-4 right-14 bg-white/95 backdrop-blur-sm rounded-3xl shadow-large border border-white/60 p-6 w-80 z-10 transition-all duration-300 hover:shadow-medium text-neutral-900">
      <div className="flex justify-between items-center pb-4">
        <h2 className="text-xl font-bold text-neutral-900">
          {selectedField.label || "Unnamed Field"}
        </h2>
        <button
          onClick={onDeselect}
          className="w-8 h-8 bg-neutral-100 hover:bg-neutral-200 rounded-xl flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-neutral-600" />
        </button>
      </div>

      <div className="space-y-4 pb-6">
        <div className="flex items-center gap-3 p-3 bg-neutral-50/80 rounded-2xl">
          <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
            <MapPin className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-neutral-600 font-medium">Crop Type</p>
            <p className="text-sm font-semibold text-neutral-900">
              {selectedField.categories?.[0]?.type || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-neutral-50/80 rounded-2xl">
          <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
            <Ruler className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-neutral-600 font-medium">Area</p>
            <p className="text-sm font-semibold text-neutral-900">
              {selectedField.area.toFixed(2)} m²
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => onGetDirections(selectedField)}
        disabled={isLoading}
        className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-400 text-white font-semibold py-3 px-4 rounded-2xl transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed shadow-soft hover:shadow-medium"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>Getting Location...</span>
          </>
        ) : (
          <>
            <Navigation className="w-4 h-4" />
            <span>Get Directions</span>
          </>
        )}
      </button>

      <p className="text-xs text-neutral-500 mt-3 text-center">
        {hasCustomStartPoint
          ? "Will use your placed start point"
          : "Uses your current location"}
      </p>
    </div>
  );
}
