'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';
import type { Category, Field } from '@/lib/types';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import "mapbox-gl/dist/mapbox-gl.css";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { createField, getFieldById, getFieldsByUser, updateField } from '@/actions';
import { useFields } from '@/context/fields-context';

type handlerProps = {
  mapRef: React.RefObject<mapboxgl.Map | null>;
  drawRef: React.RefObject<MapboxDraw | null>;
};

export const useMapHandlers = ({mapRef, drawRef}: handlerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalArea, setTotalArea] = useState<number>(0);

  const { fields,setFields } = useFields();

  const addLayers = (id:string,label:string,coordinates:number[][][],categories:Category[]) => {
    let lng = 0;
    let lat = 0;
    coordinates[0].forEach((point) => {
      lng += point[0];
      lat += point[1];
    });

    const center = [lng / coordinates[0].length, lat / coordinates[0].length];

    const iconImage = `${categories?.[0].type}-icon`;

    if (!mapRef.current) return;

    mapRef.current.addLayer({
      id: `${id}-icon`,
      type: "symbol",
      source: {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "Point", coordinates: center },
          properties: { icon: iconImage },
        },
      },
      layout: {
        "icon-image": iconImage,
        "icon-size": 0.7,
        "icon-offset": [-20, 0],
        "icon-allow-overlap": true,
      },
    });

    mapRef.current.addLayer({
      id: `${id}-label`,
      type: 'symbol',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: center },
          properties: { label: label },
        },
      },
      layout: {
        'text-field': label,
        'text-size': 16,
        'text-font': ['Open Sans Bold'],
        "text-offset": [1, 0],
        "text-anchor": "left",
        "text-allow-overlap": true,
        
      },
      paint: {
        'text-color': '#ffffff',
      },
    });
  }

  const handleReset = () => {
    if (drawRef.current && mapRef.current) {
      drawRef.current.deleteAll();

      fields.map((fields) => {
        if (mapRef.current?.getLayer(fields.id)) {
          mapRef.current.removeLayer(fields.id);
        }
        const labelLayerId = `${fields.id}-label`;
        if (mapRef.current?.getLayer(labelLayerId)) {
          mapRef.current.removeLayer(labelLayerId);
        }
        
        const borderLayerId = `${fields.id}-border`;
        if (mapRef.current?.getLayer(borderLayerId)) {
          mapRef.current.removeLayer(borderLayerId);
        }
        const iconLayerId = `${fields.id}-icon`;
        if (mapRef.current?.getLayer(iconLayerId)) {
          mapRef.current.removeLayer(iconLayerId);
        }
        
      });

      fields.map((fields) => {
        if (mapRef.current?.getSource(fields.id)) {
          mapRef.current.removeSource(fields.id);
        }
        const labelLayerId = `${fields.id}-label`;
        if (mapRef.current?.getSource(labelLayerId)) {
          mapRef.current.removeSource(labelLayerId);
        }
        const borderLayerId = `${fields.id}-border`;
        if (mapRef.current?.getSource(borderLayerId)) {
          mapRef.current.removeSource(borderLayerId);
        }
        const iconLayerId = `${fields.id}-icon`;
        if (mapRef.current?.getSource(iconLayerId)) {
          mapRef.current.removeSource(iconLayerId);
        }
      });

      setFields([]);
      setTotalArea(0);
    }
  };

  const handleSave = async () => {
    
    try {
      setIsSaving(true);
      const results = await Promise.all(fields.map(async(field)  => {
        const existingPolygon = await getFieldById(field.id);
        if (existingPolygon === null) {
          return await createField(field);
        }
      }));
      const failed = results.filter((res) => !res?.success);

      const validFields = fields.filter(field => 
        field && field.id && field.coordinates && field.color
      );
      if (validFields.length === 0) {
        throw new Error('No valid fields to save');
      }

      if (failed.length > 0) {
        throw new Error(`Failed to save ${failed.length} fields.`);
      }
      toast.success('All fields saved successfully!');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save fields.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoad = async () => {
    try {
      setIsLoading(true);
      const dbFields = await getFieldsByUser();
  
      if (!dbFields) {
        toast.info("No fields found in database.");
        return;
      }
  
      handleReset();
      setFields(dbFields);
  
      dbFields.forEach(({ id, color, coordinates, label, area, categories }) => {
        if (drawRef.current) {
          drawRef.current.add({
            id,
            type: "Feature",
            properties: {},
            geometry: { type: "Polygon", coordinates },
          });
        }
  
        if (!mapRef.current) return;

        setTotalArea((prev) => (prev + area));
  
        if (!mapRef.current.getSource(id)) {
          mapRef.current.addSource(id, {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: { type: "Polygon", coordinates },
              properties: { color },
            },
          });
  
          mapRef.current.addLayer({
            id,
            type: "fill",
            source: id,
            paint: { "fill-color": color, "fill-opacity": 0.5 },
          });
  
          // Add icon next to label
          addLayers(id,label,coordinates,categories);
  
          mapRef.current.addLayer({
            id: `${id}-border`,
            type: "line",
            source: id,
            paint: { "line-color": color, "line-width": 2 },
          });
        }
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load fields.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldUpdate = async (id: string, updates: Partial<Field>) => {
    try {
      if (!id || !updates || Object.keys(updates).length === 0) {
        throw new Error('Invalid update data');
      }
      setFields(currentFields => 
        currentFields.map(field => 
          field.id === id ? { ...field, isUpdating: true } : field
        )
      );
      setFields(currentFields => {
        const newFields = currentFields.map(field => 
          field.id === id ? { ...field, ...updates, isUpdating: false } : field
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
        return newFields;
      });
    } catch (error) {
      console.error('Error updating field:', error);
    
      // Revert changes in case of error
      setFields(currentFields => 
        currentFields.map(field => 
          field.id === id ? { ...field, isUpdating: false } : field
        )
      );
    
      toast.error('Failed to update field. Please try again.');
    }
  };

  const handleFieldChanges = async (field: Field,updates: Partial<Field>) => {
    try {
        // Show loading state for the specific field being updated
      setFields(currentPolygons => 
        currentPolygons.map(p => 
          p.id === field.id ? { ...p, isUpdating: true } : p
        )
      );
      const existingPolygon = await getFieldById(field.id);  
  
      let result;
      if (existingPolygon === null) {
          // Create a new field
        if (!field.id || !field.coordinates || !field.color) {
          throw new Error('Invalid field data');
        }
        result = await createField(field);
      }else{
        if (!updates || Object.keys(updates).length === 0) {
          throw new Error('No updates provided');
        }
        result = await updateField(field.id, updates);
      }
      
      if (!result?.success) {
        throw new Error("Failed to save field to database");
      }  
    } catch (error) {
      console.error("Error saving field:", error);
      toast.error("Failed to save field.");
    }finally{
      setFields(currentPolygons => 
        currentPolygons.map(p => 
          p.id === field.id ? { ...p, isUpdating: false } : p
        )
      );
    }
  };

  const handleCategorySelect = (categoryType: string, label:string) => {

    fields[fields.length-1].label = label;
    fields[fields.length-1].categories = [{type:categoryType}];

    // Create the new field with the category
    const newField = {
      ...fields[fields.length-1],
      categories: [{type:categoryType}],
      label: label
    };

    // Add the label to the map if it exists
    addLayers(newField.id,newField.label,newField.coordinates,newField.categories);  
  };

  return {
    isLoading,
    isSaving,
    error,
    totalArea,
    handleReset,
    handleSave,
    handleLoad,
    handleFieldUpdate,
    handleFieldChanges,
    handleCategorySelect
  };
};