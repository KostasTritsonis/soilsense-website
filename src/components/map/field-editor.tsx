"use client";
import { getAllCategories } from "@/actions";
import { Field } from "@/lib/types";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";

type FieldEditorProps = {
  field: Field | null;
  onUpdate: (id: string, updates: Partial<Field>) => void;
  onSave: (field: Field, updates: Partial<Field>) => void; // Function to save to database
  onClose: () => void;
};

export default function FieldEditor({
  field,
  onUpdate,
  onSave,
  onClose,
}: FieldEditorProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getAllCategories().then((categories) => setCategories(categories));
  }, []);

  if (!field) return null;
  return (
    <div className="absolute bottom-3 right-14 z-10 bg-[#2A3330]/70 p-4 rounded-lg sm:w-[250px] w-[200px] h-[330px] shadow-lg border border-zinc-800">
      <div className="space-y-4">
        {/* Label Input */}
        <div>
          <label className="block text-zinc-300 text-sm mb-1">Label</label>
          <input
            type="text"
            value={field.label || ""}
            onChange={(e) => onUpdate(field.id, { label: e.target.value })}
            className="w-full px-2 py-1 rounded bg-[#2A3330] text-white border text-center border-zinc-700 focus:border-blue-500 focus:outline-none"
            disabled={field.isUpdating}
          />
        </div>

        <div>
          <label className="block text-zinc-300 text-sm mb-1">Category</label>
          <select
            className="w-full px-2 py-1 rounded bg-[#2A3330] text-white text-center border border-zinc-700 focus:border-blue-500 focus:outline-none"
            value={field.categories?.[0]?.type || ""}
            onChange={(e) =>
              onUpdate(field.id, { categories: [{ type: e.target.value }] })
            }
            disabled={field.isUpdating}
          >
            {categories.map((category) => (
              <option key={category.type} value={category.type}>
                {category.type}
              </option>
            ))}
          </select>
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-zinc-300 text-sm mb-1">Color</label>
          <input
            type="color"
            value={field.color}
            onChange={(e) => onUpdate(field.id, { color: e.target.value })}
            className="w-full cursor-pointer"
            disabled={field.isUpdating}
          />
        </div>

        {/* Updating Spinner */}
        {field.isUpdating && (
          <div className="text-blue-400 text-sm flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            Saving...
          </div>
        )}

        {/* Area Display */}
        <div className="text-zinc-100 text-sm">
          Area: {field.area?.toFixed(2) || 0} &#13217; <br />
          Category: {field.categories?.[0].type || "Uncategorized"}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <button
            className="w-full bg-[#3B82F6] text-white px-3 py-1 rounded hover:bg-blue-500 disabled:opacity-50"
            onClick={() => {
              onSave(field, {
                label: field.label,
                color: field.color,
                area: field.area,
                coordinates: field.coordinates,
                categories: field.categories ?? [{ type: "Uncategorized" }],
              });
            }}
            disabled={field.isUpdating}
          >
            Update
          </button>

          <button
            className="w-full bg-zinc-500 text-white px-3 py-1 rounded hover:bg-zinc-600"
            onClick={onClose} // Just close the editor
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
