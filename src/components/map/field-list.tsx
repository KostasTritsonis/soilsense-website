import { deleteField } from '@/actions';
import { useFields } from '@/context/fields-context';

type FieldListProps = {
  onFieldSelect: (fieldId: string) => void;
  selectedFieldId: string | null;
};

export default function FieldList({ onFieldSelect, selectedFieldId }: FieldListProps) {
  const { fields } = useFields();
  
  return (
    <div className="w-full">
      {fields.length === 0 ? (
        <div className="text-zinc-400 text-center py-4">
          No fields created yet
        </div>
      ) : (
        <div className="space-y-2">
          {fields.map((field) => (
            <div
              key={field.id}
              onClick={() => onFieldSelect(field.id)}
              className={`cursor-pointer p-2 rounded transition-colors ${
                selectedFieldId === field.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-[#2A3330] border border-white/30 text-zinc-100 hover:bg-[#556962]'
              }`}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" 
                  style={{ backgroundColor: field.color }}
                />
                <span className="text-sm sm:text-base truncate">
                  {field.label || 'Unnamed Field'}
                </span>
                <button className='ml-auto z-10' onClick={() =>deleteField(field.id)}>❌</button>
              </div>
              <div className="text-xs mt-1 opacity-80">
                Area: {((field.area || 0)).toFixed(2)} &#13217; <br />
                Category: {field.categories?.[0]?.type || 'Uncategorized'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}