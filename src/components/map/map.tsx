"use client";
import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "./loading-spinner";
import { MapSetup } from "@/lib/map-creation";
import InfoPanel from "./info-panel";
import MapControls from "./map-controls";
import FieldList from "./field-list";
import FieldInfoPanel from "./field-info-panel";
import { useUser } from "@clerk/nextjs";
import CategoryModal from "./caterogy-modal";
import { useMapHandlers } from "@/lib/hooks";
import { useFields } from "@/context/fields-context";
import { Field } from "@/lib/types";
import { getDirections } from "@/lib/directions";
import { centroid } from "@turf/turf";
import mapboxgl from "mapbox-gl";
import FieldEditor from "./field-editor";

export default function MapComponent() {
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDirectionMode, setIsDirectionMode] = useState(false);
  const [startPoint, setStartPoint] = useState<[number, number] | null>(null);
  const { isSignedIn } = useUser();
  const { fields } = useFields();
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
    setStartPoint,
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

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isDirectionMode) return;

    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      setStartPoint(coords);

      // Remove previous marker if it exists
      if (startPointMarkerRef.current) {
        startPointMarkerRef.current.remove();
      }

      // Add a new marker
      const marker = new mapboxgl.Marker().setLngLat(coords).addTo(map);
      startPointMarkerRef.current = marker;

      setIsDirectionMode(false); // Exit direction mode after selecting a point
    };

    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
    };
  }, [isDirectionMode, mapRef]);

  const handleFieldSelect = (fieldId: string | null) => {
    if (fieldId) {
      const field = fields.find((f) => f.id === fieldId);
      setSelectedField(field || null);
    } else {
      setSelectedField(null);
    }
  };

  const handleGetDirections = async (field: Field) => {
    if (!mapRef.current) return;

    const getRoute = async (startLngLat: [number, number]) => {
      // Get field's center
      const fieldPolygon = {
        type: "Polygon",
        coordinates: field.coordinates,
      } as const;
      const center = centroid(fieldPolygon);
      const fieldLngLat: [number, number] = center.geometry.coordinates as [
        number,
        number
      ];

      // Fetch directions
      const route = await getDirections(startLngLat, fieldLngLat);

      // Draw route on map
      const routeId = "directions-route";
      if (mapRef.current?.getSource(routeId)) {
        (mapRef.current.getSource(routeId) as mapboxgl.GeoJSONSource).setData(
          route
        );
      } else {
        mapRef.current?.addSource(routeId, {
          type: "geojson",
          data: route,
        });
        mapRef.current?.addLayer({
          id: routeId,
          type: "line",
          source: routeId,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3887be",
            "line-width": 5,
            "line-opacity": 0.75,
          },
        });
      }
    };

    if (startPoint) {
      getRoute(startPoint).catch((error) => {
        console.error("Failed to get directions from selected point:", error);
        alert("Error: Could not get directions from the selected point.");
      });
    } else {
      // Fallback to geolocation if no start point is set
      const geolocate = new mapboxgl.GeolocateControl();
      new Promise<GeolocationPosition>((resolve, reject) => {
        geolocate.on("geolocate", resolve);
        geolocate.on("error", reject);
        geolocate.trigger();
      })
        .then((position) => {
          const userLngLat: [number, number] = [
            position.coords.longitude,
            position.coords.latitude,
          ];
          getRoute(userLngLat);
        })
        .catch((error) => {
          console.error("Failed to get directions using geolocation:", error);
          alert(
            "Error: Could not get directions. Please ensure you have enabled location services."
          );
        });
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full max-sm:pb-[60px] relative">
      {/* Loading spinner */}
      {(isLoading || isSaving) && <LoadingSpinner />}

      {/* Sidebar toggle button - visible on mobile */}
      <button
        className={`absolute ${
          isSidebarOpen
            ? "left-44 sm:left-60 md:left-72 lg:left-80 rounded-r-lg"
            : "rounded-lg top-1 left-12"
        } z-20 bg-[#2A3330] text-white p-2 shadow-lg trasition duration-300`}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? "✕" : "☰"}
      </button>

      {/* Main content with map */}
      <div className="flex-grow h-screen relative">
        {/* Map container */}
        <div ref={mapContainer} className="w-full h-full relative">
          {/* Sidebar */}
          <div
            className={`${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 absolute z-10 w-44 sm:w-60 md:w-72 lg:w-80 h-full bg-[#2A3330] text-white shadow-lg overflow-y-auto flex flex-col`}
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
              onToggleDirectionMode={() => setIsDirectionMode(!isDirectionMode)}
              isDirectionMode={isDirectionMode}
            />

            {/* Info panel in sidebar */}
            <InfoPanel
              lng={lng}
              lat={lat}
              zoom={zoom}
              fieldArea={fieldArea > 0 ? fieldArea : totalArea}
            />

            {/* Field list in sidebar */}
            <div className="flex-grow p-4 overflow-y-auto">
              <h2 className="text-lg font-semibold mb-2">Fields</h2>
              <FieldList
                onFieldSelect={handleFieldSelect}
                selectedFieldId={selectedField?.id || null}
                onEditField={setEditingFieldId}
              />
            </div>

            {/* Input Category in sidebar */}
            {/* <div className="p-4 border-t border-zinc-700">
              <InputCategory />
            </div> */}
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

        {/* Field Info Panel */}
        {selectedField && (
          <FieldInfoPanel
            selectedField={selectedField}
            onGetDirections={handleGetDirections}
            onDeselect={() => setSelectedField(null)}
          />
        )}
        {editingFieldId && (
          <FieldEditor
            field={fields.find((p) => p.id === editingFieldId) || null}
            onUpdate={handleFieldUpdate}
            onSave={handleFieldChanges}
            onClose={() => setEditingFieldId(null)}
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
