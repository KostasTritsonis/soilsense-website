type MapControlsProps = {
  onReset: () => void;
  onSave: () => void;
  onLoad: () => void;
  isLoading: boolean;
  isSaving: boolean;
  hasFields: boolean;
};
  
export default function MapControls ({ onReset, onSave, onLoad, isLoading, isSaving, hasFields }: MapControlsProps)  {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold mb-2">Map Controls</h2>
      <div className="flex flex-col space-y-2">
        <button
          onClick={onReset}
          className="bg-red-500 enabled:hover:bg-red-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50 w-full"
          disabled={isLoading || isSaving || !hasFields}
        >
          Reset Map
        </button>
        <button
          onClick={onSave}
          className="bg-blue-500 enabled:hover:bg-blue-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50 w-full"
          disabled={isLoading || isSaving || !hasFields}
        >
          {isSaving ? 'Creating...' : 'Create Fields'}
        </button>
        <button
          onClick={onLoad}
          className="bg-amber-950 hover:bg-amber-900 text-white p-2 rounded-lg transition-colors disabled:opacity-50 w-full"
          disabled={isLoading || isSaving}
        >
          {isLoading ? 'Loading...' : 'Load Fields'}
        </button>
      </div>
    </div>
  );
};