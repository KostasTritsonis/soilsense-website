import { useState } from "react";
import { createCategory } from "@/actions";
import { Plus, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function InputCategory() {
  const [categoryName, setCategoryName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const t = useTranslations();

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) return;

    setIsSaving(true);
    setError("");

    try {
      await createCategory(categoryName);
      setCategoryName(""); // Reset input after saving
    } catch (err) {
      setError(t("fields.categoryError"));
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 pb-3 sm:pb-4">
        {t("fields.addCategory")}
      </h2>
      <div className="space-y-2 sm:space-y-3">
        <input
          type="text"
          placeholder={t("fields.newCategoryName")}
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-neutral-700/80 backdrop-blur-sm border border-neutral-200 dark:border-neutral-600 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 disabled:opacity-60 text-sm sm:text-base"
          disabled={isSaving}
        />
        <button
          className="flex items-center justify-center gap-2 w-full py-2.5 sm:py-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 disabled:bg-neutral-400 dark:disabled:bg-neutral-600 text-white font-semibold rounded-xl sm:rounded-2xl transition-colors disabled:opacity-50 shadow-soft hover:shadow-medium text-sm sm:text-base"
          onClick={handleCreateCategory}
          disabled={isSaving || !categoryName.trim()}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
              {t("common.saving")}
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {t("fields.addCategory")}
            </>
          )}
        </button>
        {error && (
          <div className="p-2.5 sm:p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl sm:rounded-2xl">
            <p className="text-red-700 dark:text-red-400 text-xs sm:text-sm">
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
