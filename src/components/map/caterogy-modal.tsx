'use client';

import { getAllCategories } from "@/actions";
import { Category } from "@/lib/types";
import { useEffect, useState } from "react";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (category: string, label: string) => void;
}

export default function CategoryModal({ isOpen, onClose, onConfirm }: CategoryModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    type: 'General'
  });
  const [fieldLabel, setFieldLabel] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchCategories();
      // Reset the label when modal opens
      setFieldLabel('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Add Field Details</h2>

        {/* Add label input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Field Label
          </label>
          <input
            type="text"
            value={fieldLabel}
            onChange={(e) => setFieldLabel(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter field label"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <select
              className="w-full p-2 border rounded"
              value={selectedCategory.type}
              onChange={(e) => {
                const category = categories.find(c => c.type === e.target.value);
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

        <div className="flex justify-between mt-4">
          <button 
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            onClick={() => {
              onConfirm(selectedCategory.type, fieldLabel);
              onClose();
            }}
            disabled={!fieldLabel.trim()}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}