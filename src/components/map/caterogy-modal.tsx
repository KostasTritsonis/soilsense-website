"use client";

import { getAllCategories } from "@/actions";
import { Category } from "@/lib/types";
import { useEffect, useState } from "react";
import { Loader2, X, Tag } from "lucide-react";
import { useTranslations } from "next-intl";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (category: string, label: string) => void;
}

export default function CategoryModal({
  isOpen,
  onClose,
  onConfirm,
}: CategoryModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    type: "General",
  });
  const [fieldLabel, setFieldLabel] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const fetchedCategories = await getAllCategories();
        setCategories(fetchedCategories);
        if (fetchedCategories.length > 0) {
          setSelectedCategory(fetchedCategories[0]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchCategories();
      setFieldLabel("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 dark:bg-black/60 z-50 p-3 sm:p-4">
      <div className="bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-large border border-white/60 dark:border-neutral-700/60 p-4 sm:p-6 md:p-8 w-full max-w-sm md:w-96 relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-3 sm:top-4 right-3 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors z-10"
          onClick={onClose}
        >
          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-600 dark:text-neutral-400" />
        </button>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3 sm:mb-4 md:mb-6 flex items-center gap-2 pr-8 sm:pr-10">
          <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
          <span>{t("fields.addFieldDetails")}</span>
        </h2>

        {/* Add label input */}
        <div className="mb-3 sm:mb-4 md:mb-6">
          <label className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 sm:mb-2">
            {t("fields.fieldLabel")}
          </label>
          <input
            type="text"
            value={fieldLabel}
            onChange={(e) => setFieldLabel(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-neutral-200 dark:border-neutral-600 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-neutral-700/80 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 text-sm sm:text-base"
            placeholder={t("fields.fieldLabel")}
          />
        </div>

        <div className="mb-3 sm:mb-4 md:mb-6">
          <label className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 sm:mb-2">
            {t("fields.fieldCategory")}
          </label>
          {isLoading ? (
            <div className="flex justify-center py-3 sm:py-4">
              <Loader2 className="animate-spin w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400" />
            </div>
          ) : (
            <select
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-neutral-200 dark:border-neutral-600 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-neutral-700/80 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 text-neutral-900 dark:text-neutral-100 text-sm sm:text-base"
              value={selectedCategory.type}
              onChange={(e) => {
                const category = categories.find(
                  (c) => c.type === e.target.value
                );
                if (category) {
                  setSelectedCategory(category);
                }
              }}
            >
              {categories.map((category: Category) => (
                <option key={category.type} value={category.type}>
                  {category.type}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3 mt-4 sm:mt-6">
          <button
            className="flex-1 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 font-semibold py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition-colors text-sm sm:text-base"
            onClick={onClose}
          >
            {t("common.cancel")}
          </button>
          <button
            className="flex-1 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-semibold py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition-colors shadow-soft hover:shadow-medium disabled:bg-neutral-400 dark:disabled:bg-neutral-600 disabled:cursor-not-allowed text-sm sm:text-base"
            onClick={() => {
              onConfirm(selectedCategory.type, fieldLabel);
              onClose();
            }}
            disabled={!fieldLabel.trim()}
          >
            {t("common.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
