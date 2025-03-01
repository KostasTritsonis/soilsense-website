'use client';
import { useEffect, useState } from 'react';
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
  const  { isSignedIn } =  useUser();
  const { fields } = useFields();

   useEffect(() => {
      handleLoad();
    }, []);

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

  return (
    <div className={`relative bg-zinc-50 w-screen h-screen md:mt-2`} >
      {(isLoading || isSaving) && <LoadingSpinner />}
      
      <div ref={mapContainer} className='w-full h-full'/>

      {(!isSignedIn)?
        <div className="absolute z-50 inset-0 flex items-center justify-center bg-black/70 ">
          <p className="text-lg text-white font-semibold">Please sign in to access the map</p>
        </div>:''
      }

      <CategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCategorySelect}
      />
      {!isModalOpen && (
        <>
          <InfoPanel
            lng={lng}
            lat={lat}
            fieldArea={fieldArea > 0 ? fieldArea : totalArea}
          />

          <MapControls
            onReset={handleReset}
            onSave={handleSave}
            onLoad={handleLoad}
            isLoading={isLoading}
            isSaving={isSaving}
            hasFields={fields.length > 0}
          />
          
          <FieldList
            onFieldSelect={setSelectedFieldId}
            selectedFieldId={selectedFieldId}
          />

          {selectedFieldId && (
            <FieldEditor
              field={fields.find(p => p.id === selectedFieldId) || null}
              onUpdate={handleFieldUpdate}
              onSave={handleFieldChanges}
              onClose={() => setSelectedFieldId(null)}
            />
          )}

          <InputCategory />
        </>
      )}
    </div>
  );
}
