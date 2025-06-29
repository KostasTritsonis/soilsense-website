"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import type { Category, Field } from "@/lib/types";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { createField, getFieldsByUser, updateField } from "@/actions";
import { useFields } from "@/context/fields-context";

type handlerProps = {
  mapRef: React.RefObject<mapboxgl.Map | null>;
  drawRef: React.RefObject<MapboxDraw | null>;
  startPointMarkerRef?: React.RefObject<mapboxgl.Marker | null>;
  setStartPoint?: React.Dispatch<React.SetStateAction<[number, number] | null>>;
};

export const useMapHandlers = ({
  mapRef,
  drawRef,
  startPointMarkerRef,
  setStartPoint,
}: handlerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalArea, setTotalArea] = useState<number>(0);

  const { fields, setFields } = useFields();

  const addLayers = (
    id: string,
    label: string,
    coordinates: number[][][],
    categories: Category[]
  ) => {
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
        "icon-size": 0.8,
        "icon-offset": [-20, 0],
        "icon-allow-overlap": true,
      },
      minzoom: 16,
    });

    mapRef.current.addLayer({
      id: `${id}-label`,
      type: "symbol",
      source: {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "Point", coordinates: center },
          properties: { label: label },
        },
      },
      layout: {
        "text-field": label,
        "text-size": 14,
        "text-font": ["Open Sans Bold"],
        "text-offset": [1, 0],
        "text-anchor": "left",
        "text-allow-overlap": true,
      },
      paint: {
        "text-color": "#ffffff",
      },
      minzoom: 16,
    });
  };

  const handleReset = () => {
    if (drawRef.current && mapRef.current) {
      drawRef.current.deleteAll();

      // Clear the directions route if it exists
      const directionsRouteId = "directions-route";
      if (mapRef.current.getLayer(directionsRouteId)) {
        mapRef.current.removeLayer(directionsRouteId);
      }
      if (mapRef.current.getSource(directionsRouteId)) {
        mapRef.current.removeSource(directionsRouteId);
      }

      // Clear the start point marker and state
      if (startPointMarkerRef?.current) {
        startPointMarkerRef.current.remove();
        startPointMarkerRef.current = null;
      }
      if (setStartPoint) {
        setStartPoint(null);
      }

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
      const existingFields = await getFieldsByUser();
      const results = await Promise.all(
        fields.map(async (field) =>
          existingFields?.some((f) => f.id === field.id)
            ? updateField(field.id, field)
            : createField(field)
        )
      );
      const failed = results.filter((res) => !res?.success);

      const validFields = fields.filter(
        (field) => field && field.id && field.coordinates && field.color
      );
      if (validFields.length === 0) {
        throw new Error("No valid fields to save");
      }

      if (failed.length > 0) {
        throw new Error(`Failed to save ${failed.length} fields.`);
      }
      toast.success("All fields saved successfully!");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to save fields."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoad = async () => {
    try {
      setIsLoading(true);
      const dbFields = await getFieldsByUser();

      if (!dbFields) {
        return;
      }

      handleReset();
      setFields(dbFields);

      dbFields.forEach(
        ({ id, color, coordinates, label, area, categories }) => {
          if (drawRef.current) {
            drawRef.current.add({
              id,
              type: "Feature",
              properties: {},
              geometry: { type: "Polygon", coordinates },
            });
          }

          if (!mapRef.current) return;

          setTotalArea((prev) => prev + area);

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
            addLayers(id, label, coordinates, categories);

            mapRef.current.addLayer({
              id: `${id}-border`,
              type: "line",
              source: id,
              paint: { "line-color": color, "line-width": 2 },
            });
          }
        }
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load fields."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldUpdate = async (id: string, updates: Partial<Field>) => {
    try {
      if (!id || !updates || Object.keys(updates).length === 0) {
        throw new Error("Invalid update data");
      }
      setFields((currentFields) =>
        currentFields.map((field) =>
          field.id === id ? { ...field, isUpdating: true } : field
        )
      );
      setFields((currentFields) => {
        const newFields = currentFields.map((field) =>
          field.id === id ? { ...field, ...updates, isUpdating: false } : field
        );

        // Update map visualization
        if (mapRef.current) {
          // Update color if changed
          if (updates.color && mapRef.current.getLayer(id)) {
            mapRef.current.setPaintProperty(id, "fill-color", updates.color);

            const borderLayerId = `${id}-border`;
            if (mapRef.current.getLayer(borderLayerId)) {
              mapRef.current.setPaintProperty(
                borderLayerId,
                "line-color",
                updates.color
              );
            }
          }

          // Update label if changed
          if (updates.label) {
            const labelLayerId = `${id}-label`;
            if (mapRef.current.getLayer(labelLayerId)) {
              mapRef.current.setLayoutProperty(
                labelLayerId,
                "text-field",
                updates.label
              );
            }
          }
        }
        return newFields;
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update field."
      );
    }
  };

  const handleFieldChanges = async (field: Field, updates: Partial<Field>) => {
    try {
      setIsSaving(true);
      const updatedField = { ...field, ...updates };
      const result = await updateField(field.id, updatedField);

      if (result.success) {
        setFields((currentFields) =>
          currentFields.map((f) => (f.id === field.id ? updatedField : f))
        );
        toast.success(`Field "${updatedField.label}" updated successfully.`);
      } else {
        const errorMessage = (result as { error?: unknown }).error;
        throw new Error(String(errorMessage) || "Failed to update field.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCategorySelect = (categoryType: string, label: string) => {
    if (drawRef.current) {
      drawRef.current.getAll();
      const all = drawRef.current.getAll();
      if (all.features.length > 0) {
        const fieldId = all.features[all.features.length - 1].id as string;
        setFields((prev) =>
          prev.map((f) =>
            f.id === fieldId
              ? { ...f, label: label, categories: [{ type: categoryType }] }
              : f
          )
        );

        const field = fields.find((f) => f.id === fieldId);
        if (field) {
          addLayers(field.id, label, field.coordinates, [
            { type: categoryType },
          ]);
        }
      }
    }
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
    handleCategorySelect,
  };
};
