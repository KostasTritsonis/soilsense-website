import { RotateCcw, Save, Upload, Loader2 } from "lucide-react";

type MapControlsProps = {
  onReset: () => void;
  onSave: () => void;
  onLoad: () => void;
  isLoading: boolean;
  isSaving: boolean;
  hasFields: boolean;
};

export default function MapControls({
  onReset,
  onSave,
  onLoad,
  isLoading,
  isSaving,
  hasFields,
}: MapControlsProps) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex flex-col space-y-3">
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-neutral-400 text-white font-semibold py-3 px-4 rounded-2xl transition-colors disabled:opacity-50 w-full shadow-soft hover:shadow-medium"
          disabled={isLoading || isSaving || !hasFields}
        >
          <RotateCcw className="w-4 h-4" />
          Reset Map
        </button>

        <button
          onClick={onSave}
          className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-400 text-white font-semibold py-3 px-4 rounded-2xl transition-colors disabled:opacity-50 w-full shadow-soft hover:shadow-medium"
          disabled={isLoading || isSaving || !hasFields}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Create/Save Fields
            </>
          )}
        </button>

        <button
          onClick={onLoad}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-400 text-white font-semibold py-3 px-4 rounded-2xl transition-colors disabled:opacity-50 w-full shadow-soft hover:shadow-medium"
          disabled={isLoading || isSaving}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Load Fields
            </>
          )}
        </button>
      </div>
    </div>
  );
}
