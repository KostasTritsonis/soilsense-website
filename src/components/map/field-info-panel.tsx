import { Field } from "@/lib/types";
import { FaLocationArrow, FaMapMarkerAlt, FaRuler } from "react-icons/fa";

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
    <div className="absolute bottom-4 right-14 bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl shadow-green-100/40 p-6 w-80 z-10 transition-transform hover:scale-105 hover:shadow-green-200/60 text-zinc-900">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {selectedField.label || "Unnamed Field"}
        </h2>
        <button
          onClick={onDeselect}
          className="text-gray-300 hover:text-white transition-colors"
        >
          ❌
        </button>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2">
          <FaMapMarkerAlt className="text-green-400" />
          <span>
            <strong>Crop:</strong>{" "}
            {selectedField.categories?.[0]?.type || "N/A"}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <FaRuler className="text-blue-400" />
          <span>
            <strong>Area:</strong> {selectedField.area.toFixed(2)} m²
          </span>
        </div>
      </div>

      <button
        onClick={() => onGetDirections(selectedField)}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Getting Location...</span>
          </>
        ) : (
          <>
            <FaLocationArrow />
            <span>Get Directions</span>
          </>
        )}
      </button>

      <p className="text-xs text-gray-400 mt-2 text-center">
        {hasCustomStartPoint
          ? "Will use your placed start point"
          : "Uses your current location"}
      </p>
    </div>
  );
}
