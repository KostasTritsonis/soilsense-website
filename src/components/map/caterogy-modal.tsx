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
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-large border border-white/60 p-6 md:p-8 w-full max-w-sm md:w-96 relative">
        <button
          className="absolute top-4 right-4 w-8 h-8 bg-neutral-100 hover:bg-neutral-200 rounded-xl flex items-center justify-center transition-colors"
          onClick={onClose}
        >
          <X className="w-4 h-4 text-neutral-600" />
        </button>
        <h2 className="text-lg md:text-xl font-bold text-neutral-900 mb-4 md:mb-6 flex items-center gap-2">
          <Tag className="w-5 h-5 text-primary-600" />
          {t("fields.addFieldDetails")}
        </h2>

        {/* Add label input */}
        <div className="mb-4 md:mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {t("fields.fieldLabel")}
          </label>
          <input
            type="text"
            value={fieldLabel}
            onChange={(e) => setFieldLabel(e.target.value)}
            className="w-full px-4 py-3 border border-neutral-200 rounded-2xl bg-white/80 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-neutral-900 placeholder-neutral-400"
            placeholder={t("fields.fieldLabel")}
          />
        </div>

        <div className="mb-4 md:mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {t("fields.fieldCategory")}
          </label>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin w-6 h-6 text-primary-600" />
            </div>
          ) : (
            <select
              className="w-full px-4 py-3 border border-neutral-200 rounded-2xl bg-white/80 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-neutral-900"
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

        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
          <button
            className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold py-3 rounded-2xl transition-colors"
            onClick={onClose}
          >
            {t("common.cancel")}
          </button>
          <button
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-2xl transition-colors shadow-soft hover:shadow-medium disabled:bg-neutral-400 disabled:cursor-not-allowed"
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
