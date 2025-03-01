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
    <div className="absolute sm:top-4 sm:right-4 md:top-5 md:right-14 z-10 text-[11px] sm:text-[14px] flex gap-2">
      <button
        onClick={onReset}
        className="bg-red-500 enabled:hover:bg-red-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
        disabled={isLoading || isSaving || !hasFields}>
        Reset Map
      </button>
      <button
        onClick={onSave}
        className="bg-blue-500 enabled:hover:bg-blue-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
        disabled={isLoading || isSaving || !hasFields}>
        {isSaving ? 'Creating...' : 'Create Fields'}
      </button>
      <button
        onClick={onLoad}
        className="bg-amber-950 hover:bg-amber-900 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
        disabled={isLoading || isSaving}>
        {isLoading ? 'Loading...' : 'Load Fields'}
      </button>
    </div>
  );
};