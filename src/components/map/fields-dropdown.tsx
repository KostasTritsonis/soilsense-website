"use client";
import { deleteField } from "@/actions";
import { useFieldsStore } from "@/lib/stores/fields-store";
import { Edit, X, MapPin, Ruler, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";

type FieldsDropdownProps = {
  onFieldSelect: (fieldId: string | null) => void;
  selectedFieldId: string | null;
  onEditField: (fieldId: string) => void;
};

export default function FieldsDropdown({
  onFieldSelect,
  selectedFieldId,
  onEditField,
}: FieldsDropdownProps) {
  const { fields, removeField } = useFieldsStore();
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDeleteField = (e: React.MouseEvent, fieldId: string) => {
    e.stopPropagation();
    deleteField(fieldId);
    removeField(fieldId);
  };

  const handleFieldClick = (fieldId: string) => {
    onFieldSelect(fieldId);
    setIsOpen(false);
  };

  const selectedField = fields.find((f) => f.id === selectedFieldId);

  return (
    <>
      <style>{`
        .scrollable-dropdown::-webkit-scrollbar {
          width: 6px;
        }
        .scrollable-dropdown::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollable-dropdown::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        .scrollable-dropdown::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      `}</style>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between gap-3 bg-white/95 dark:bg-neutral-800/90 backdrop-blur-sm border border-white/60 dark:border-neutral-700/60 rounded-xl px-4 py-3 shadow-soft hover:shadow-medium transition-all duration-200 min-w-[300px]"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {selectedField ? (
              <>
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: selectedField.color }}
                />
                <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-300 truncate">
                  {selectedField.label || t("common.unnamed")}
                </span>
              </>
            ) : (
              <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                {fields.length === 0
                  ? t("fields.noFields")
                  : t("fields.selectField")}
              </span>
            )}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-neutral-500 dark:text-neutral-400 transition-transform duration-200 flex-shrink-0 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 max-h-96 overflow-hidden bg-white/95 dark:bg-neutral-800/90 backdrop-blur-sm border border-white/60 dark:border-neutral-700/60 rounded-2xl shadow-large z-50">
            <div className="scrollable-dropdown overflow-y-auto max-h-96 py-2 pr-2">
              {fields.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-700/90 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-6 h-6 text-neutral-400" />
                  </div>
                  <p className="text-neutral-500 dark:text-neutral-400 font-medium">
                    {t("fields.noFieldsCreated")}
                  </p>
                  <p className="text-sm text-neutral-400">
                    {t("fields.createFirstField")}
                  </p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {fields.map((field) => (
                    <div
                      key={field.id}
                      onClick={() => handleFieldClick(field.id)}
                      className={`cursor-pointer p-4 rounded-xl transition-all duration-200 relative ${
                        selectedFieldId === field.id
                          ? "bg-primary-100 dark:bg-blue-500/20 border-2 border-primary-200 dark:border-blue-500/40 shadow-medium"
                          : "bg-white/80 dark:bg-neutral-800/90 backdrop-blur-sm border border-white/60 dark:border-neutral-600/70 hover:bg-white/90 hover:shadow-soft"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: field.color }}
                        />
                        <span
                          className={`text-sm font-semibold truncate flex-1 ${
                            selectedFieldId === field.id
                              ? "text-primary-900 dark:text-blue-300"
                              : "text-neutral-900 dark:text-neutral-300"
                          }`}
                        >
                          {field.label || t("common.unnamed")}
                        </span>
                        <button
                          className="w-6 h-6 bg-red-100 dark:bg-red-900/10 hover:bg-red-200 dark:hover:bg-red-900/20 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                          onClick={(e) => handleDeleteField(e, field.id)}
                        >
                          <X className="w-3 h-3 text-red-600 dark:text-red-400" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2">
                          <Ruler className="w-3 h-3 text-neutral-500 dark:text-neutral-400" />
                          <span className="text-xs text-neutral-600 dark:text-neutral-400">
                            {(field.area || 0).toFixed(2)} m²
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-neutral-500 dark:text-neutral-400" />
                          <span className="text-xs text-neutral-600 dark:text-neutral-400">
                            {field.categories?.[0]?.type ||
                              t("common.uncategorized")}
                          </span>
                        </div>
                      </div>

                      <button
                        className={`absolute top-4 right-12 w-6 h-6 flex items-center justify-center rounded-lg transition-colors ${
                          selectedFieldId === field.id
                            ? "bg-primary-200 dark:bg-blue-500/30 hover:bg-primary-300 dark:hover:bg-blue-500/40"
                            : "bg-neutral-100 dark:bg-neutral-700/90 hover:bg-neutral-200 dark:hover:bg-neutral-800/90"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditField(field.id);
                          setIsOpen(false);
                        }}
                      >
                        <Edit
                          className={`w-3 h-3 ${
                            selectedFieldId === field.id
                              ? "text-primary-700 dark:text-blue-300"
                              : "text-neutral-500 dark:text-neutral-400"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
