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
      <h2 className="text-lg font-semibold text-neutral-900 pb-4">
        {t("fields.addCategory")}
      </h2>
      <div className="space-y-3">
        <input
          type="text"
          placeholder={t("fields.newCategoryName")}
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-neutral-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-neutral-900 placeholder-neutral-500 disabled:opacity-60"
          disabled={isSaving}
        />
        <button
          className="flex items-center justify-center gap-2 w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-400 text-white font-semibold rounded-2xl transition-colors disabled:opacity-50 shadow-soft hover:shadow-medium"
          onClick={handleCreateCategory}
          disabled={isSaving || !categoryName.trim()}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t("common.saving")}
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              {t("fields.addCategory")}
            </>
          )}
        </button>
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
