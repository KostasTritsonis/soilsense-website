import { useState } from "react";
import { createCategory } from "@/actions"; // Function to save category in DB

export default function CategoryInput() {
  const [categoryName, setCategoryName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) return;

    setIsSaving(true);
    setError("");

    try {
      await createCategory(categoryName);
      setCategoryName(""); // Reset input after saving
    } catch (err) {
      setError("Failed to create category.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="absolute md:top-4 md:right-[30%]  flex items-center gap-2 bg-zinc-900 p-1 rounded-md">
      <input
        type="text"
        placeholder="New category"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        className="flex-1 px-2 py-1 rounded bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
        disabled={isSaving}
      />
      <button
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50"
        onClick={handleCreateCategory}
        disabled={isSaving || !categoryName.trim()}
      >
        {isSaving ? "Saving..." : "Add"}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}