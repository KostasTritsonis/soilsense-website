import { deleteField } from "@/actions";
import { useFields } from "@/context/fields-context";
import { FaPencilAlt } from "react-icons/fa";

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
  const { fields, setFields } = useFields();

  const handleDeleteField = (e: React.MouseEvent, fieldId: string) => {
    e.stopPropagation();
    deleteField(fieldId);
    setFields((prev) => prev.filter((f) => f.id !== fieldId));
  };

  return (
    <div className="w-full">
      {fields.length === 0 ? (
        <div className="text-zinc-400 text-center py-4">
          No fields created yet
        </div>
      ) : (
        <div className="relative space-y-2">
          {fields.map((field) => (
            <div
              key={field.id}
              onClick={() => onFieldSelect(field.id)}
              className={`cursor-pointer p-2 rounded transition-colors relative ${
                selectedFieldId === field.id
                  ? "bg-blue-600 text-white"
                  : "bg-[#2A3330] border border-white/30 text-zinc-100 hover:bg-[#556962]"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                  style={{ backgroundColor: field.color }}
                />
                <span className="text-sm sm:text-base truncate">
                  {field.label || "Unnamed Field"}
                </span>
                <button
                  className="ml-auto w-8"
                  onClick={(e) => handleDeleteField(e, field.id)}
                >
                  ❌
                </button>
              </div>

              <div className="text-xs mt-1 opacity-80">
                Area: {(field.area || 0).toFixed(2)} &#13217; <br />
                Category: {field.categories?.[0]?.type || "Uncategorized"}
              </div>

              <button
                className="absolute bottom-2 right-3 w-6 h-6 flex items-center justify-center text-white/70 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditField(field.id);
                }}
              >
                <FaPencilAlt />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
