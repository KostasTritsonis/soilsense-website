import { useState } from "react";
import { createCategory } from "@/actions"; // Function to save category in DB

export default function InputCategory() {
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
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-2">Add Category</h2>
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          placeholder="New category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="w-full px-3 py-2 rounded bg-zinc-700 text-white border border-zinc-600 focus:border-blue-500 focus:outline-none"
          disabled={isSaving}
        />
        <button
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50 transition-colors"
          onClick={handleCreateCategory}
          disabled={isSaving || !categoryName.trim()}
        >
          {isSaving ? "Saving..." : "Add Category"}
        </button>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </div>
  );
}