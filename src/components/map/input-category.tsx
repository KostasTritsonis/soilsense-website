import { useState } from "react";
import { createCategory } from "@/actions";
import { Add } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
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
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 pb-4">
        {t("fields.addCategory")}
      </h2>
      <div className="space-y-3">
        <input
          type="text"
          placeholder={t("fields.newCategoryName")}
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl md:rounded-2xl bg-white/80 dark:bg-neutral-700/80 backdrop-blur-sm border border-neutral-200 dark:border-neutral-600 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 disabled:opacity-60 text-sm md:text-base"
          disabled={isSaving}
        />
        <button
          className="flex items-center justify-center gap-2 w-full py-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 disabled:bg-neutral-400 dark:disabled:bg-neutral-600 text-white font-semibold rounded-xl md:rounded-2xl transition-colors disabled:opacity-50 shadow-soft hover:shadow-medium text-sm md:text-base"
          onClick={handleCreateCategory}
          disabled={isSaving || !categoryName.trim()}
        >
          {isSaving ? (
            <>
              <CircularProgress size={16} />
              {t("common.saving")}
            </>
          ) : (
            <>
              <Add fontSize="small" />
              {t("fields.addCategory")}
            </>
          )}
        </button>
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl md:rounded-2xl">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
