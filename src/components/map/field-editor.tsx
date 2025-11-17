"use client";
import { getAllCategories } from "@/actions";
import { Field } from "@/lib/types";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";
import { Loader2, Palette } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations();

  useEffect(() => {
    getAllCategories().then((categories) => setCategories(categories));
  }, []);

  if (!field) return null;
  return (
    <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 md:bottom-3 md:right-14 md:left-auto z-[100] bg-white/95 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-large border border-white/60 dark:border-neutral-700/60 p-3 sm:p-4 w-auto md:w-[270px] max-h-[80vh] md:max-h-[435px] md:h-[390px] overflow-y-auto">
      <div className="space-y-2 sm:space-y-3">
        {/* Label Input */}
        <div>
          <label className="block text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm mb-1.5 sm:mb-2">
            {t("fields.fieldLabel")}
          </label>
          <input
            type="text"
            value={field.label || ""}
            onChange={(e) => onUpdate(field.id, { label: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-white/80 dark:bg-neutral-700/80 border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 text-sm sm:text-base"
            disabled={field.isUpdating}
          />
        </div>

        <div>
          <label className="block text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm mb-1.5 sm:mb-2">
            {t("fields.fieldCategory")}
          </label>
          <select
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-white/80 dark:bg-neutral-700/80 border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 text-sm sm:text-base"
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

        <label className="flex items-center gap-1.5 sm:gap-2 text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm mb-1.5 sm:mb-2">
          <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-600 dark:text-neutral-300 flex-shrink-0" />
          {t("fields.fieldColor")}
        </label>
        <input
          type="color"
          value={field.color || "#22c55e"}
          onChange={(e) => onUpdate(field.id, { color: e.target.value })}
          className="w-full h-9 sm:h-10 cursor-pointer bg-white dark:bg-neutral-700/80 border border-neutral-200 dark:border-neutral-600 rounded-lg sm:rounded-xl"
          disabled={field.isUpdating}
        />

        {/* Updating Spinner */}
        {field.isUpdating && (
          <div className="text-primary-600 dark:text-primary-400 text-xs sm:text-sm flex items-center gap-2">
            <Loader2 className="animate-spin w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {t("common.saving")}
          </div>
        )}

        {/* Area Display */}
        <div className="text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm">
          {t("fields.area")}: {field.area?.toFixed(2) || 0}{" "}
          {t("units.squareMeters")} <br />
          {t("fields.fieldCategory")}:{" "}
          {field.categories?.[0].type || t("common.uncategorized")}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 mt-3 sm:mt-4">
          <button
            className="w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl transition-colors shadow-soft hover:shadow-medium disabled:bg-neutral-400 dark:disabled:bg-neutral-600 disabled:opacity-60 text-sm sm:text-base"
            onClick={() => {
              onSave(field, {
                label: field.label,
                color: field.color,
                area: field.area,
                coordinates: field.coordinates,
                categories: field.categories ?? [
                  { type: t("common.uncategorized") },
                ],
              });
            }}
            disabled={field.isUpdating}
          >
            {t("common.update")}
          </button>

          <button
            className="w-full bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl transition-colors text-sm sm:text-base"
            onClick={onClose}
          >
            {t("common.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}
