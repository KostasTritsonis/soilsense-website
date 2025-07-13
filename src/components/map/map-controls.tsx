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
    <div className="p-4 space-y-4 text-sm">
      <div className="flex flex-col space-y-2">
        <button
          onClick={onReset}
          className="bg-[#EB5757] enabled:hover:bg-[#D64545] text-white p-2 rounded-lg transition-colors disabled:opacity-50 w-full"
          disabled={isLoading || isSaving || !hasFields}
        >
          Reset Map
        </button>
        <button
          onClick={onSave}
          className="bg-[#8B4513] enabled:hover:bg-[#7A3D0E] text-white p-2 rounded-lg transition-colors disabled:opacity-50 w-full"
          disabled={isLoading || isSaving || !hasFields}
        >
          {isSaving ? "Creating..." : "Create/Save Fields"}
        </button>
        <button
          onClick={onLoad}
          className="bg-[#2A9D8F] hover:bg-[#258A7D] text-white p-2 rounded-lg transition-colors disabled:opacity-50 w-full"
          disabled={isLoading || isSaving}
        >
          {isLoading ? "Loading..." : "Load Fields"}
        </button>
      </div>
    </div>
  );
}
