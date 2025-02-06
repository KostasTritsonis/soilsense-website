'use client';
import { useState } from 'react';
import LoadingSpinner from './loading-spinner';
import { useMapHandlers, useMapSetup } from '@/lib/hooks';
import InfoPanel from './info-panel';
import MapControls from './map-controls';
import PolygonList from './polygon-list';
import PolygonEditor from './polygon-editor';
import { Polygon } from '@/lib/types';
import { createPolygon, getPolygonById, updatePolygon } from '@/actions/actions';
import { toast } from 'react-toastify';

export default function MapComponent() {
  const {
    mapContainer,
    polygons,
    mapRef,
    drawRef,
    lng,
    lat,
    polygonArea,
    selectedColor,
    setPolygons,
    setSelectedColor
  } = useMapSetup();

  const {
    isLoading,
    isSaving,
    handleReset,
    handleSave,
    loadPolygons
  } = useMapHandlers({mapRef, drawRef,polygons, setPolygons});

  const [selectedPolygonId, setSelectedPolygonId] = useState<string | null>(null);

  const handlePolygonUpdate = async (id: string, updates: Partial<Polygon>) => {
    try {
        setPolygons(currentPolygons => 
          currentPolygons.map(polygon => 
            polygon.id === id ? { ...polygon, isUpdating: true } : polygon
          )
        );
        setPolygons(currentPolygons => {
          const newPolygons = currentPolygons.map(polygon => 
            polygon.id === id ? { ...polygon, ...updates, isUpdating: false } : polygon
          );
          
          // Update map visualization
          if (mapRef.current) {
            // Update color if changed
            if (updates.color && mapRef.current.getLayer(id)) {
              mapRef.current.setPaintProperty(id, 'fill-color', updates.color);

              const borderLayerId = `${id}-border`;
              if (mapRef.current.getLayer(borderLayerId)) {
                mapRef.current.setPaintProperty(borderLayerId, "line-color", updates.color);
              }
            }
    
            // Update label if changed
            if (updates.label) {
              const labelLayerId = `${id}-label`;
              if (mapRef.current.getLayer(labelLayerId)) {
                mapRef.current.setLayoutProperty(
                  labelLayerId,
                  'text-field',
                  updates.label
                );
              }
            }
          }
          
          toast.success('Field updated successfully');
          return newPolygons;
        });
      } catch (error) {
        console.error('Error updating polygon:', error);
      
        // Revert changes in case of error
        setPolygons(currentPolygons => 
          currentPolygons.map(polygon => 
            polygon.id === id ? { ...polygon, isUpdating: false } : polygon
          )
        );
      
        toast.error('Failed to update field. Please try again.');
    }
  };


  const savePolygonChanges = async (polygon: Polygon,updates: Partial<Polygon>) => {
    try {
        // Show loading state for the specific polygon being updated
      setPolygons(currentPolygons => 
        currentPolygons.map(p => 
          p.id === polygon.id ? { ...p, isUpdating: true } : p
        )
      );
      const existingPolygon = await getPolygonById(polygon.id);
  
      let result;
      if (existingPolygon === null) {
         // Create a new polygon
        result = await createPolygon(polygon);
      }else{
        result = await updatePolygon(polygon.id, updates);
      }
      
      if (!result?.success) {
        throw new Error("Failed to save polygon to database");
      }  

      toast.success("Field saved successfully");
  
    } catch (error) {
      console.error("Error saving polygon:", error);
      toast.error("Failed to save field.");
    }finally{
      setPolygons(currentPolygons => 
        currentPolygons.map(p => 
          p.id === polygon.id ? { ...p, isUpdating: false } : p
        )
      );
    }
  };

  return (
    <div className=" relative  bg-zinc-100  w-[95%] h-[450px] sm:h-[600px] md:h-[800px] lg:h-[900px] p-2 md:p-8" >
      {(isLoading || isSaving) && <LoadingSpinner />}
      
      <div ref={mapContainer} className="flex-1 w-full h-full " />
      
      <InfoPanel
        lng={lng}
        lat={lat}
        polygonArea={polygonArea}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
      />

      <MapControls
        onReset={handleReset}
        onSave={handleSave}
        onLoad={loadPolygons}
        isLoading={isLoading}
        isSaving={isSaving}
        hasPolygons={polygons.length > 0}
      />

      <PolygonList
        polygons={polygons}
        onPolygonSelect={setSelectedPolygonId}
        selectedPolygonId={selectedPolygonId}
      />

      {selectedPolygonId && (
        <PolygonEditor
          polygon={polygons.find(p => p.id === selectedPolygonId) || null}
          onUpdate={handlePolygonUpdate}
          onSave={savePolygonChanges}
          onClose={() => setSelectedPolygonId(null)}
        />
      )}
    </div>
  );
}
