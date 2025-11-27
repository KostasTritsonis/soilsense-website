"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import LoadingSpinner from "./loading-spinner";
import { MapSetup } from "@/lib/map-creation";
import InfoPanel from "./info-panel";
import FieldInfoPanel from "./field-info-panel";
import { useUser } from "@clerk/nextjs";
import CategoryModal from "./caterogy-modal";
import { useMapHandlers } from "@/lib/hooks";
import { useFieldsStore } from "@/lib/stores/fields-store";
import { Field } from "@/lib/types";
import { centroid } from "@turf/turf";
import mapboxgl from "mapbox-gl";
import FieldEditor from "./field-editor";
import DirectionsPanel from "./directions-panel";
import FieldsDropdown from "./fields-dropdown";

type MapComponentProps = {
  onHandlersReady?: (handlers: {
    handleReset: () => void;
    handleSave: () => void;
    handleLoad: () => void;
    isLoading: boolean;
    isSaving: boolean;
    hasFields: boolean;
  }) => void;
  initialFieldId?: string;
};

export default function MapComponent(
  {
    onHandlersReady,
    initialFieldId,
  }: MapComponentProps = {} as MapComponentProps
) {
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [showDirectionsPanel, setShowDirectionsPanel] = useState(false);
  const [isGettingDirections, setIsGettingDirections] = useState(false);
  const [destinationCoordinates, setDestinationCoordinates] = useState<
    [number, number] | null
  >(null);
  const { isSignedIn } = useUser();
  const { fields } = useFieldsStore();
  const startPointCoordsRef = useRef<[number, number] | null>(null);
  const startPointMarkerRef = useRef<mapboxgl.Marker | null>(null);

  const {
    mapContainer,
    mapRef,
    drawRef,
    lng,
    lat,
    zoom,
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
    handleCategorySelect,
  } = useMapHandlers({
    mapRef,
    drawRef,
    startPointMarkerRef,
  });

  const handleResetRef = useRef(handleReset);

  // Update the ref when handleLoad changes
  useEffect(() => {
    handleResetRef.current = handleReset;
  }, [handleReset]);

  // Use the ref in the effect with an empty dependency array
  useEffect(() => {
    handleResetRef.current();
  }, []);

  // Custom reset function that also clears the pin
  const handleCustomReset = useCallback(() => {
    // Clear the pin marker and coordinates
    if (startPointMarkerRef.current) {
      startPointMarkerRef.current.remove();
      startPointMarkerRef.current = null;
    }
    startPointCoordsRef.current = null;

    // Call the original reset function
    handleReset();
  }, [handleReset]);

  // Expose handlers to parent component
  const handleCustomResetRef = useRef(handleCustomReset);
  useEffect(() => {
    handleCustomResetRef.current = handleCustomReset;
  }, [handleCustomReset]);

  // Store handlers in refs to avoid recreating them
  const handleSaveRef = useRef(handleSave);
  const handleLoadRef = useRef(handleLoad);
  useEffect(() => {
    handleSaveRef.current = handleSave;
    handleLoadRef.current = handleLoad;
  }, [handleSave, handleLoad]);

  // Track previous values to only call onHandlersReady when actual values change
  const prevValuesRef = useRef<{
    isLoading: boolean;
    isSaving: boolean;
    fieldsLength: number;
  } | null>(null);

  useEffect(() => {
    if (onHandlersReady) {
      const prevValues = prevValuesRef.current;
      const hasChanged =
        prevValues === null ||
        prevValues.isLoading !== isLoading ||
        prevValues.isSaving !== isSaving ||
        prevValues.fieldsLength !== fields.length;

      if (hasChanged) {
        prevValuesRef.current = {
          isLoading,
          isSaving,
          fieldsLength: fields.length,
        };
        onHandlersReady({
          handleReset: () => handleCustomResetRef.current(),
          handleSave: () => handleSaveRef.current(),
          handleLoad: () => handleLoadRef.current(),
          isLoading,
          isSaving,
          hasFields: fields.length > 0,
        });
      }
    }
  }, [onHandlersReady, isLoading, isSaving, fields.length]);

  // Add stable click handler to map
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat];

      // Store coordinates
      startPointCoordsRef.current = coords;

      // Remove previous marker if it exists
      if (startPointMarkerRef.current) {
        startPointMarkerRef.current.remove();
      }

      // Create new marker
      const marker = new mapboxgl.Marker({
        color: "#DC2626",
        scale: 1.2,
      })
        .setLngLat(coords)
        .addTo(map);

      startPointMarkerRef.current = marker;
      console.log("Pin placed at:", coords);
    };

    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
    };
  }, [mapRef]);

  const handleFieldSelect = (fieldId: string | null) => {
    if (fieldId) {
      const field = fields.find((f) => f.id === fieldId);
      setSelectedField(field || null);

      // Navigate to the field on the map
      if (field && mapRef.current && field.coordinates) {
        try {
          const fieldPolygon = {
            type: "Polygon",
            coordinates: field.coordinates,
          } as const;
          const center = centroid(fieldPolygon);
          const [lng, lat] = center.geometry.coordinates as [number, number];

          // Fly to the field center with appropriate zoom
          mapRef.current.flyTo({
            center: [lng, lat],
            zoom: 17,
            duration: 3000,
          });
        } catch (error) {
          console.error("Error navigating to field:", error);
        }
      }
    } else {
      setSelectedField(null);
    }
  };

  // Auto-select field from URL parameter when fields are loaded
  useEffect(() => {
    if (initialFieldId && fields.length > 0 && !selectedField) {
      const field = fields.find((f) => f.id === initialFieldId);
      if (field) {
        handleFieldSelect(initialFieldId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFieldId, fields.length, selectedField]);

  const handleGetDirections = async (field: Field) => {
    setIsGettingDirections(true);

    try {
      // Get field's center coordinates
      const fieldPolygon = {
        type: "Polygon",
        coordinates: field.coordinates,
      } as const;
      const center = centroid(fieldPolygon);
      const fieldLngLat: [number, number] = center.geometry.coordinates as [
        number,
        number
      ];

      let startLngLat: [number, number] | null = null;

      // Use placed start point if available, otherwise get current location
      if (startPointCoordsRef.current) {
        startLngLat = startPointCoordsRef.current;
      } else {
        // Get current location using browser geolocation
        try {
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              if (!navigator.geolocation) {
                reject(
                  new Error("Geolocation is not supported by this browser.")
                );
                return;
              }

              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
              });
            }
          );

          startLngLat = [position.coords.longitude, position.coords.latitude];
        } catch (error) {
          console.error("Failed to get location:", error);
          // If we can't get location, just open Google Maps with destination only
          const url = `https://www.google.com/maps/search/?api=1&query=${fieldLngLat[1]},${fieldLngLat[0]}`;
          window.open(url, "_blank");
          setIsGettingDirections(false);
          return;
        }
      }

      // Open Google Maps with directions
      if (startLngLat) {
        const url = `https://www.google.com/maps/dir/${startLngLat[1]},${startLngLat[0]}/${fieldLngLat[1]},${fieldLngLat[0]}`;
        window.open(url, "_blank");
      } else {
        // Fallback: just search for the destination
        const url = `https://www.google.com/maps/search/?api=1&query=${fieldLngLat[1]},${fieldLngLat[0]}`;
        window.open(url, "_blank");
      }
    } catch (error) {
      console.error("Error opening Google Maps:", error);
    } finally {
      setIsGettingDirections(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden">
      {/* Loading spinner */}
      {(isLoading || isSaving) && <LoadingSpinner />}

      {/* Main content with map */}
      <div className="flex-1 relative min-h-0">
        {/* Map container */}
        <div ref={mapContainer} className="w-full h-full relative">
          {/* Fields Dropdown - top center */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] sm:w-auto max-w-[70%]">
            <FieldsDropdown
              onFieldSelect={handleFieldSelect}
              selectedFieldId={selectedField?.id || null}
              onEditField={setEditingFieldId}
            />
          </div>

          {/* Info Panel - bottom left */}
          <div className="absolute bottom-2 right-12 sm:right-14 z-10">
            <InfoPanel
              lng={lng}
              lat={lat}
              zoom={zoom}
              fieldArea={fieldArea > 0 ? fieldArea : totalArea}
            />
          </div>

          {/* Field Info Panel - mobile optimized */}
          {selectedField && (
            <FieldInfoPanel
              selectedField={selectedField}
              onGetDirections={handleGetDirections}
              onDeselect={() => setSelectedField(null)}
              isLoading={isGettingDirections}
              hasCustomStartPoint={startPointCoordsRef.current !== null}
            />
          )}

          {/* Field Editor */}
          {editingFieldId && (
            <FieldEditor
              field={fields.find((p) => p.id === editingFieldId) || null}
              onUpdate={handleFieldUpdate}
              onSave={handleFieldChanges}
              onClose={() => setEditingFieldId(null)}
            />
          )}
        </div>

        {/* Auth overlay */}
        {!isSignedIn && (
          <div className="absolute z-50 inset-0 flex items-center justify-center bg-black/70">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-large border border-white/60 p-6 md:p-8 mx-4">
              <p className="text-base md:text-lg text-neutral-900 dark:text-neutral-100 font-semibold text-center">
                Please sign in to access the map
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCategorySelect}
      />

      {/* Directions Panel */}
      {showDirectionsPanel && selectedField && (
        <DirectionsPanel
          onClose={() => {
            setShowDirectionsPanel(false);
            setDestinationCoordinates(null);
          }}
          startPoint={startPointCoordsRef.current}
          destination={selectedField?.label || "Field"}
          destinationCoordinates={destinationCoordinates || undefined}
        />
      )}
    </div>
  );
}
