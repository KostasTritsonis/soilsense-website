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
import { getDirections, RouteInfo } from "@/lib/directions";
import { centroid } from "@turf/turf";
import mapboxgl from "mapbox-gl";
import FieldEditor from "./field-editor";
import DirectionsPanel from "./directions-panel";

export default function MapComponent() {
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [showDirectionsPanel, setShowDirectionsPanel] = useState(false);
  const [isGettingDirections, setIsGettingDirections] = useState(false);
  const { isSignedIn } = useUser();
  const { fields } = useFields();
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
  const handleCustomReset = () => {
    // Clear the pin marker and coordinates
    if (startPointMarkerRef.current) {
      startPointMarkerRef.current.remove();
      startPointMarkerRef.current = null;
    }
    startPointCoordsRef.current = null;

    // Call the original reset function
    handleReset();
  };

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
    } else {
      setSelectedField(null);
    }
  };

  const handleGetDirections = async (field: Field) => {
    if (!mapRef.current) return;

    setIsGettingDirections(true);

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

      // Fetch directions with enhanced route info
      const routeInfo = await getDirections(startLngLat, fieldLngLat);

      // Store route info for the directions panel
      setRouteInfo(routeInfo);
      setShowDirectionsPanel(true);

      // Draw route on map using the geometry from routeInfo
      const routeId = "directions-route";
      if (mapRef.current?.getSource(routeId)) {
        (mapRef.current.getSource(routeId) as mapboxgl.GeoJSONSource).setData(
          routeInfo.geometry as unknown as GeoJSON.Feature
        );
      } else {
        mapRef.current?.addSource(routeId, {
          type: "geojson",
          data: routeInfo.geometry as unknown as GeoJSON.Feature,
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

    try {
      let userLngLat: [number, number];

      // Use placed start point if available, otherwise get current location
      if (startPointCoordsRef.current) {
        userLngLat = startPointCoordsRef.current;
        console.log("Using placed start point:", userLngLat);
      } else {
        // Get current location using browser geolocation
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

        userLngLat = [position.coords.longitude, position.coords.latitude];

        // Update start point state for the directions panel
        startPointCoordsRef.current = userLngLat;
        console.log("Using current location:", userLngLat);
      }

      // Get the route
      await getRoute(userLngLat);
    } catch (error) {
      console.error("Failed to get location:", error);
      alert(
        "Error: Could not get your location. Please ensure you have enabled location services or place a start point on the map."
      );
    } finally {
      setIsGettingDirections(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full max-sm:pb-[60px] relative bg-neutral-100">
      {/* Loading spinner */}
      {(isLoading || isSaving) && <LoadingSpinner />}

      {/* Sidebar toggle button - visible on mobile */}
      <button
        className={`absolute ${
          isSidebarOpen
            ? "left-44 sm:left-60 md:left-72 lg:left-80 rounded-r-xl"
            : "rounded-2xl top-1 left-12"
        } z-20 bg-primary-600 text-white p-2 shadow-soft transition-all duration-300 hover:bg-primary-700 focus:outline-none `}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <span> ✕</span> : <span>☰</span>}
      </button>

      {/* Main content with map */}
      <div className="flex-grow h-screen relative">
        {/* Map container */}
        <div ref={mapContainer} className="w-full h-full relative">
          {/* Sidebar */}
          <div
            className={`${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 absolute z-10 w-44 sm:w-60 md:w-72 lg:w-80 h-full bg-white/95 backdrop-blur-sm  shadow-large border-r border-white/60 overflow-y-auto flex flex-col`}
          >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-blue-50 rounded-tr-3xl">
              <h1 className="text-2xl font-bold text-primary-700 tracking-tight">
                Field Manager
              </h1>
            </div>

            {/* Controls section in sidebar */}
            <MapControls
              onReset={handleCustomReset}
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
              zoom={zoom}
              fieldArea={fieldArea > 0 ? fieldArea : totalArea}
            />

            {/* Field list in sidebar */}
            <div className="flex-grow p-4 overflow-y-auto">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Fields
              </h2>
              <FieldList
                onFieldSelect={handleFieldSelect}
                selectedFieldId={selectedField?.id || null}
                onEditField={setEditingFieldId}
              />
            </div>
          </div>
        </div>

        {/* Auth overlay */}
        {!isSignedIn && (
          <div className="absolute z-50 inset-0 flex items-center justify-center bg-black/70">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-large border border-white/60 p-8">
              <p className="text-lg text-neutral-900 font-semibold text-center">
                Please sign in to access the map
              </p>
            </div>
          </div>
        )}

        {/* Field Info Panel */}
        {selectedField && (
          <FieldInfoPanel
            selectedField={selectedField}
            onGetDirections={handleGetDirections}
            onDeselect={() => setSelectedField(null)}
            isLoading={isGettingDirections}
            hasCustomStartPoint={startPointCoordsRef.current !== null}
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

      {/* Directions Panel */}
      {showDirectionsPanel && routeInfo && (
        <DirectionsPanel
          routeInfo={routeInfo}
          onClose={() => {
            setShowDirectionsPanel(false);
            setRouteInfo(null);
            // Clear the route from the map
            if (mapRef.current?.getSource("directions-route")) {
              (
                mapRef.current.getSource(
                  "directions-route"
                ) as mapboxgl.GeoJSONSource
              ).setData({
                type: "Feature",
                properties: {},
                geometry: { type: "LineString", coordinates: [] },
              });
            }
          }}
          startPoint={startPointCoordsRef.current}
          destination={selectedField?.label || "Field"}
        />
      )}
    </div>
  );
}
