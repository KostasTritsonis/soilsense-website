import { Field } from "@/lib/types";
import { FaLocationArrow } from "react-icons/fa";

type FieldInfoPanelProps = {
  selectedField: Field;
  onGetDirections: (field: Field) => void;
  onDeselect: () => void;
};

export default function FieldInfoPanel({
  selectedField,
  onGetDirections,
  onDeselect,
}: FieldInfoPanelProps) {
  return (
    <div className="absolute bottom-14 right-14 bg-[#2A3330] text-white p-4 rounded-lg shadow-lg w-80 z-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {selectedField.label || "Unnamed Field"}
        </h2>
        <button onClick={onDeselect}>❌</button>
      </div>
      <div className="space-y-2">
        <p>
          <strong>Crop:</strong> {selectedField.categories?.[0]?.type || "N/A"}
        </p>
        <p>
          <strong>Area:</strong> {selectedField.area.toFixed(2)} m²
        </p>
      </div>
      <button
        onClick={() => onGetDirections(selectedField)}
        className="mt-4 w-full border border-white/30 rounded-md p-2"
      >
        <FaLocationArrow className="mr-2" />
        Get Directions
      </button>
    </div>
  );
}
