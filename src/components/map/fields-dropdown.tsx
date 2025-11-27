"use client";
import { deleteField } from "@/actions";
import { useFieldsStore } from "@/lib/stores/fields-store";
import {
  Edit,
  Close,
  LocationOn,
  Straighten,
  ExpandMore,
} from "@mui/icons-material";
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
      <div className="relative w-full" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between gap-2 md:gap-3 bg-white/95 dark:bg-neutral-800/90 backdrop-blur-sm border border-white/60 dark:border-neutral-700/60 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 shadow-soft hover:shadow-medium transition-all duration-200 w-full sm:min-w-[280px] md:min-w-[300px]"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {selectedField ? (
              <>
                <div
                  className="w-3 h-3 md:w-4 md:h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: selectedField.color }}
                />
                <span className="text-xs md:text-sm font-semibold text-neutral-900 dark:text-neutral-300 truncate">
                  {selectedField.label || t("common.unnamed")}
                </span>
              </>
            ) : (
              <span className="text-xs md:text-sm font-medium text-neutral-500 dark:text-neutral-400 truncate">
                {fields.length === 0
                  ? t("fields.noFields")
                  : t("fields.selectField")}
              </span>
            )}
          </div>
          <ExpandMore
            className={`text-neutral-500 dark:text-neutral-400 transition-transform duration-200 flex-shrink-0 ${
              isOpen ? "rotate-180" : ""
            }`}
            fontSize="small"
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[calc(100vw-5rem)] sm:w-96 max-h-[60vh] md:max-h-96 overflow-hidden bg-white/95 dark:bg-neutral-800/90 backdrop-blur-sm border border-white/60 dark:border-neutral-700/60 rounded-xl md:rounded-2xl shadow-large z-50">
            <div className="scrollable-dropdown overflow-y-auto max-h-[60vh] md:max-h-96 py-2">
              {fields.length === 0 ? (
                <div className="p-4 md:p-6 text-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-neutral-100 dark:bg-neutral-700/90 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-3">
                    <LocationOn
                      className="text-neutral-400"
                      sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
                    />
                  </div>
                  <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                    {t("fields.noFieldsCreated")}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {t("fields.createFirstField")}
                  </p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {fields.map((field) => (
                    <div
                      key={field.id}
                      onClick={() => handleFieldClick(field.id)}
                      className={`cursor-pointer flex flex-col p-3 md:p-4 rounded-lg md:rounded-xl transition-all duration-200 relative ${
                        selectedFieldId === field.id
                          ? "bg-primary-100 dark:bg-blue-500/20 border-2 border-primary-200 dark:border-blue-500/40 shadow-medium"
                          : "bg-white/80 dark:bg-neutral-800/90 backdrop-blur-sm border border-white/60 dark:border-neutral-600/70 hover:bg-white/90 hover:shadow-soft"
                      }`}
                    >
                      <div className="flex items-center gap-2 md:gap-3 pr-20 md:pr-12">
                        <div
                          className="w-3 h-3 md:w-4 md:h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: field.color }}
                        />
                        <span
                          className={`text-xs md:text-sm font-semibold truncate flex-1 ${
                            selectedFieldId === field.id
                              ? "text-primary-900 dark:text-blue-300"
                              : "text-neutral-900 dark:text-neutral-300"
                          }`}
                        >
                          {field.label || t("common.unnamed")}
                        </span>
                        <button
                          className="flex items-center justify-center gap-1 px-1.5 sm:px-0 sm:w-5 md:w-6 bg-red-100 dark:bg-red-900/10 hover:bg-red-200 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0 absolute top-3 md:top-4 right-12 md:right-4 h-5 sm:h-auto"
                          onClick={(e) => handleDeleteField(e, field.id)}
                        >
                          <Close
                            className="text-red-600 dark:text-red-400 flex-shrink-0"
                            fontSize="small"
                          />
                          <span className="text-xs text-red-600 dark:text-red-400 font-medium sm:hidden">
                            {t("common.delete")}
                          </span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Straighten
                            className="text-neutral-500 dark:text-neutral-400 flex-shrink-0"
                            fontSize="small"
                          />
                          <span className="text-xs text-neutral-600 dark:text-neutral-400">
                            {(field.area || 0).toFixed(2)} m²
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <LocationOn
                            className="text-neutral-500 dark:text-neutral-400 flex-shrink-0"
                            fontSize="small"
                          />
                          <span className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                            {field.categories?.[0]?.type ||
                              t("common.uncategorized")}
                          </span>
                        </div>
                      </div>

                      <button
                        className={`absolute top-3 md:top-4 right-2 md:right-10 flex items-center justify-center gap-1 px-1.5 sm:px-0 sm:w-5 md:w-6 rounded-lg transition-colors h-5 sm:h-auto ${
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
                          className={`w-3 h-3 flex-shrink-0 ${
                            selectedFieldId === field.id
                              ? "text-primary-700 dark:text-blue-300"
                              : "text-neutral-500 dark:text-neutral-400"
                          }`}
                        />
                        <span
                          className={`text-xs font-medium sm:hidden ${
                            selectedFieldId === field.id
                              ? "text-primary-700 dark:text-blue-300"
                              : "text-neutral-500 dark:text-neutral-400"
                          }`}
                        >
                          {t("common.edit")}
                        </span>
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
