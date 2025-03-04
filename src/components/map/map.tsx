'use client';
import { useEffect, useRef, useState } from 'react';
import LoadingSpinner from './loading-spinner';
import { MapSetup } from '@/lib/map-creation';
import InfoPanel from './info-panel';
import MapControls from './map-controls';
import FieldList from './field-list';
import FieldEditor from './field-editor';
import { useUser } from '@clerk/nextjs';
import CategoryModal from './caterogy-modal';
import InputCategory from './input-category';
import { useMapHandlers } from '@/lib/hooks';
import { useFields } from '@/context/fields-context';



export default function MapComponent() {

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const  { isSignedIn } =  useUser();
  const { fields } = useFields();
  const {
    mapContainer,
    mapRef,
    drawRef,
    lng,
    lat,
    fieldArea,
    isModalOpen,
    setIsModalOpen,
    
  } = MapSetup();
 
  const {
    isLoading,
    isSaving,
    totalArea,
    handleReset,
    handleSave,
    handleLoad,
    handleFieldUpdate,
    handleFieldChanges,
    handleCategorySelect
  } = useMapHandlers({mapRef, drawRef});

  const handleResetRef = useRef(handleReset);
    
    // Update the ref when handleLoad changes
    useEffect(() => {
      handleResetRef.current = handleReset;
    }, [handleReset]);
  
    // Use the ref in the effect with an empty dependency array
    useEffect(() => {
      handleResetRef.current();
    }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-zinc-50 max-sm:pb-[60px] relative">
      {/* Loading spinner */}
      {(isLoading || isSaving) && <LoadingSpinner />}

      {/* Sidebar toggle button - visible on mobile */}
      <button
        className={`md:hidden absolute ${
          isSidebarOpen ? 'left-44 rounded-r-lg' : 'rounded-lg top-1 left-12'
        } z-20 bg-zinc-700 text-white p-2 shadow-lg`}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      {/* Main content with map */}
      <div className="flex-grow h-screen relative">
        {/* Map container */}
        <div ref={mapContainer} className="w-full h-full relative">
          {/* Sidebar */}
          <div
            className={`${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 absolute z-10 w-44 sm:w-60 md:w-72 lg:w-80 h-full bg-zinc-800 text-white shadow-lg overflow-y-auto flex flex-col`}
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-zinc-700">
              <h1 className="text-xl font-bold">Field Manager</h1>
            </div>

            {/* Controls section in sidebar */}
            <MapControls
              onReset={handleReset}
              onSave={handleSave}
              onLoad={handleLoad}
              isLoading={isLoading}
              isSaving={isSaving}
              hasFields={fields.length > 0}
            />

            {/* Info panel in sidebar */}
            <InfoPanel
              lng={lng}
              lat={lat}
              fieldArea={fieldArea > 0 ? fieldArea : totalArea}
            />

            {/* Field list in sidebar */}
            <div className="flex-grow p-4 overflow-y-auto">
              <h2 className="text-lg font-semibold mb-2">Fields</h2>
              <FieldList
                onFieldSelect={setSelectedFieldId}
                selectedFieldId={selectedFieldId}
              />
            </div>

            {/* Input Category in sidebar */}
            <div className="p-4 border-t border-zinc-700">
              <InputCategory />
            </div>
          </div>
        </div>

        {/* Auth overlay */}
        {!isSignedIn && (
          <div className="absolute z-50 inset-0 flex items-center justify-center bg-black/70">
            <p className="text-lg text-white font-semibold">
              Please sign in to access the map
            </p>
          </div>
        )}

        {/* Field editor - repositioned */}
        {selectedFieldId && (
          <FieldEditor
            field={fields.find((p) => p.id === selectedFieldId) || null}
            onUpdate={handleFieldUpdate}
            onSave={handleFieldChanges}
            onClose={() => setSelectedFieldId(null)}
          />
        )}
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCategorySelect}
      />
    </div>
  );
}
