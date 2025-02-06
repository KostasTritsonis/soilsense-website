type MapControlsProps = {
  onReset: () => void;
  onSave: () => void;
  onLoad: () => void;
  isLoading: boolean;
  isSaving: boolean;
  hasPolygons: boolean;
};
  
export default function MapControls ({ onReset, onSave, onLoad, isLoading, isSaving, hasPolygons }: MapControlsProps)  {
  return (
    <div className="absolute sm:top-4 sm:right-4 md:top-10 md:right-14 z-10 text-[11px] sm:text-[14px] flex flex-col gap-2">
      <button
        onClick={onReset}
        className="bg-red-500 enabled:hover:bg-red-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
        disabled={isLoading || isSaving || !hasPolygons}>
        Reset Map
      </button>
      <button
        onClick={onSave}
        className="bg-blue-500 enabled:hover:bg-blue-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
        disabled={isLoading || isSaving || !hasPolygons}>
        {isSaving ? 'Saving...' : 'Save polygons'}
      </button>
      <button
        onClick={onLoad}
        className="bg-amber-950 hover:bg-amber-900 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
        disabled={isLoading || isSaving}>
        {isLoading ? 'Loading...' : 'Load polygons'}
      </button>
    </div>
  );
};