'use client';
import { Polygon } from "@/lib/types";

type PolygonEditorProps = {
  polygon: Polygon | null;
  onUpdate: (id: string, updates: Partial<Polygon>) => void;
  onSave: (polygon: Polygon, updates: Partial<Polygon>) => void; // Function to save to database
  onClose: () => void;
};

export default function PolygonEditor({ polygon, onUpdate, onSave, onClose }: PolygonEditorProps) {
  if (!polygon) return null;
  return (
    <div className="absolute bottom-10 right-10 z-10 bg-zinc-950/90 p-4 rounded-lg min-w-[250px] shadow-lg border border-zinc-800">
      <div className="space-y-4">
        
        {/* Label Input */}
        <div>
          <label className="block text-zinc-300 text-sm mb-1">Label</label>
          <input
            type="text"
            value={polygon.label || ''}
            onChange={(e) => onUpdate(polygon.id, { label: e.target.value })}
            className="w-full px-2 py-1 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
            disabled={polygon.isUpdating}
          />
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-zinc-300 text-sm mb-1">Color</label>
          <input
            type="color"
            value={polygon.color}
            onChange={(e) => onUpdate(polygon.id, { color: e.target.value })}
            className="w-full cursor-pointer"
            disabled={polygon.isUpdating}
          />
        </div>

        {/* Updating Spinner */}
        {polygon.isUpdating && (
          <div className="text-blue-400 text-sm flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            Saving...
          </div>
        )}

        {/* Area Display */}
        <div className="text-zinc-400 text-sm">
          Area: {polygon.area?.toFixed(2) || 0} &#13217;
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <button
            className="w-full bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500 disabled:opacity-50"
            onClick={() => {onSave(polygon, { label: polygon.label, color: polygon.color,area: polygon.area })}}
            disabled={polygon.isUpdating}
          >
            Save
          </button>

          <button
            className="w-full bg-zinc-700 text-white px-3 py-1 rounded hover:bg-zinc-600"
            onClick={onClose} // Just close the editor
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
