import { deleteField } from "@/actions";
import { useFieldsStore } from "@/lib/stores/fields-store";
import { Edit, X, MapPin, Ruler } from "lucide-react";
import { useTranslations } from "next-intl";

type FieldListProps = {
  onFieldSelect: (fieldId: string) => void;
  selectedFieldId: string | null;
  onEditField: (fieldId: string) => void;
};

export default function FieldList({
  onFieldSelect,
  selectedFieldId,
  onEditField,
}: FieldListProps) {
  const { fields, removeField } = useFieldsStore();
  const t = useTranslations();

  const handleDeleteField = (e: React.MouseEvent, fieldId: string) => {
    e.stopPropagation();
    deleteField(fieldId);
    removeField(fieldId);
  };

  return (
    <div className="w-full">
      {fields.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <MapPin className="w-6 h-6 text-neutral-400" />
          </div>
          <p className="text-neutral-500 font-medium">
            {t("fields.noFieldsCreated")}
          </p>
          <p className="text-sm text-neutral-400">
            {t("fields.createFirstField")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((field) => (
            <div
              key={field.id}
              onClick={() => onFieldSelect(field.id)}
              className={`cursor-pointer p-4 rounded-2xl transition-all duration-200 relative ${
                selectedFieldId === field.id
                  ? "bg-primary-100 border-2 border-primary-200 shadow-medium"
                  : "bg-white/80 backdrop-blur-sm border border-white/60 hover:bg-white/90 hover:shadow-soft"
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
                      ? "text-primary-900"
                      : "text-neutral-900"
                  }`}
                >
                  {field.label || t("common.unnamed")}
                </span>
                <button
                  className="w-6 h-6 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                  onClick={(e) => handleDeleteField(e, field.id)}
                >
                  <X className="w-3 h-3 text-red-600" />
                </button>
              </div>

              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <Ruler className="w-3 h-3 text-neutral-500" />
                  <span className="text-xs text-neutral-600">
                    {(field.area || 0).toFixed(2)} m²
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-neutral-500" />
                  <span className="text-xs text-neutral-600">
                    {field.categories?.[0]?.type || t("common.uncategorized")}
                  </span>
                </div>
              </div>

              <button
                className={`absolute top-4 right-12 w-6 h-6 flex items-center justify-center rounded-lg transition-colors ${
                  selectedFieldId === field.id
                    ? "bg-primary-200 text-primary-700 hover:bg-primary-300"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onEditField(field.id);
                }}
              >
                <Edit className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
