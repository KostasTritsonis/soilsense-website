import { useFields } from '@/context/fields-context';
import { Field } from '@/lib/types';

type FieldListProps = {
  onFieldSelect: (fieldId: string) => void;
  selectedFieldId: string | null;
};

export default function FieldList({onFieldSelect, selectedFieldId }: FieldListProps){

  const { fields } = useFields();
  return (
    <div className={`absolute left-0 top-0  z-10 w-[250px] rounded-e-xl bg-zinc-900 p-4 shadow-lg transition-transform ${fields.length > 0 ? 'transform translate-x-0' : 'transform -translate-x-full'}`}>
      <h3 className="text-white text-[12px] sm:text-lg text-center font-semibold mb-2">Field List</h3>
      <div className="space-y-2">
        {fields.map((field) => (
          <div
            key={field.id}
            onClick={() => onFieldSelect(field.id)}
            className={`cursor-pointer py-1 rounded text-sm sm:text-lg ${
              selectedFieldId === field.id 
                ? 'bg-blue-500 text-white' 
                : 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" 
                style={{ backgroundColor: field.color }}
              />
              <span>{field.label || 'Unnamed Field'}</span>
            </div>
            <div className="text-xs text-zinc-400 mt-1">
              Area: {((field.area || 0)).toFixed(2)} &#13217; <br />
              Category: {field.categories?.[0].type || 'Uncategorized'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
