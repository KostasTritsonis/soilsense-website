"use client";
import { getAllCategories } from "@/actions";
import { Field } from "@/lib/types";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";
import { Loader2, Palette } from "lucide-react";

type FieldEditorProps = {
  field: Field | null;
  onUpdate: (id: string, updates: Partial<Field>) => void;
  onSave: (field: Field, updates: Partial<Field>) => void;
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
    <div className="absolute bottom-4 left-4 right-4 md:bottom-3 md:right-14 md:left-auto z-10 bg-white/95 backdrop-blur-sm rounded-3xl shadow-large border border-white/60 p-4 md:p-6 w-auto md:w-[270px] max-h-[435px] md:h-[340px] overflow-y-auto">
      <div className="space-y-4 md:space-y-5">
        {/* Label Input */}
        <div>
          <label className="block text-neutral-700 text-sm mb-2">Label</label>
          <input
            type="text"
            value={field.label || ""}
            onChange={(e) => onUpdate(field.id, { label: e.target.value })}
            className="w-full px-3 py-2 rounded-2xl bg-white/80 border border-neutral-200 text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            disabled={field.isUpdating}
          />
        </div>

        <div>
          <label className="block text-neutral-700 text-sm mb-2">
            Category
          </label>
          <select
            className="w-full px-3 py-2 rounded-2xl bg-white/80 border border-neutral-200 text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
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
          <label className="text-neutral-700 text-sm mb-2 flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary-600" />
            Color
          </label>
          <input
            type="color"
            value={field.color}
            onChange={(e) => onUpdate(field.id, { color: e.target.value })}
            className="w-full h-10 rounded-2xl cursor-pointer border border-neutral-200"
            disabled={field.isUpdating}
          />
        </div>

        {/* Updating Spinner */}
        {field.isUpdating && (
          <div className="text-primary-600 text-sm flex items-center gap-2">
            <Loader2 className="animate-spin w-4 h-4" />
            Saving...
          </div>
        )}

        {/* Area Display */}
        <div className="text-neutral-700 text-sm">
          Area: {field.area?.toFixed(2) || 0} &#13217; <br />
          Category: {field.categories?.[0].type || "Uncategorized"}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mt-3">
          <button
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold px-3 py-2 rounded-2xl transition-colors shadow-soft hover:shadow-medium disabled:bg-neutral-400 disabled:opacity-60"
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
            className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold px-3 py-2 rounded-2xl transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
