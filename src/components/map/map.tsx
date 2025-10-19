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
import { useFieldsStore } from "@/lib/stores/fields-store";
import { Field } from "@/lib/types";
import { getDirections, RouteInfo } from "@/lib/directions";
import { centroid } from "@turf/turf";
import mapboxgl from "mapbox-gl";
import FieldEditor from "./field-editor";
import DirectionsPanel from "./directions-panel";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

export default function MapComponent() {
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
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

  // Set sidebar to open by default on desktop
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
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
      // Close sidebar on mobile when field is selected
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
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

      // Store route info and destination coordinates for the directions panel
      setRouteInfo(routeInfo);
      setDestinationCoordinates(fieldLngLat);
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

  // Close sidebar when clicking outside on mobile
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full relative bg-neutral-100 overflow-hidden">
      {/* Loading spinner */}
      {(isLoading || isSaving) && <LoadingSpinner />}

      {/* Mobile header with toggle button */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white/95 backdrop-blur-sm border-b border-neutral-200 z-30">
        <h1 className="text-xl font-bold text-primary-700">Field Manager</h1>
        <button
          className="bg-primary-600 text-white p-2 rounded-xl shadow-soft transition-all duration-300 hover:bg-primary-700 focus:outline-none"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <CloseIcon className="w-6 h-6" />
          ) : (
            <MenuIcon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Main content with map */}
      <div className="flex-1 relative">
        {/* Desktop floating toggle button - only show when sidebar is closed */}
        {!isSidebarOpen && (
          <button
            className="hidden md:block absolute top-1 left-12 z-50 bg-primary-600 text-white p-2 rounded-md shadow-md transition-all duration-300 hover:bg-primary-700 focus:outline-none hover:shadow-md hover:scale-105"
            onClick={() => setIsSidebarOpen(true)}
          >
            <MenuIcon className="w-4 h-4" />
          </button>
        )}

        {/* Map container */}
        <div ref={mapContainer} className="w-full h-full relative">
          {/* Mobile backdrop overlay */}
          {isSidebarOpen && (
            <div
              className="md:hidden fixed inset-0 top-16 bg-black/50 z-40"
              onClick={handleBackdropClick}
            />
          )}

          {/* Sidebar */}
          <div
            className={`transition-transform duration-300 fixed md:absolute z-50 md:z-10 w-72 sm:w-80 md:w-72 lg:w-80 h-[calc(100vh-4rem)] md:h-full top-16 md:top-0 bg-white/95 backdrop-blur-sm shadow-large border-r border-white/60 overflow-y-auto flex flex-col ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Desktop sidebar header - hidden on mobile */}
            <div className="hidden md:block p-6 border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-blue-50 rounded-tr-3xl">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-primary-700 tracking-tight">
                  Field Manager
                </h1>
                <button
                  className="text-primary-600 hover:text-primary-700 p-2 rounded-lg transition-colors duration-200 hover:bg-primary-100"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Controls section in sidebar */}
            <div className="p-4 md:p-6">
              <MapControls
                onReset={handleCustomReset}
                onSave={handleSave}
                onLoad={handleLoad}
                isLoading={isLoading}
                isSaving={isSaving}
                hasFields={fields.length > 0}
              />
            </div>

            {/* Info panel in sidebar */}
            <div className="px-4 md:px-6 pb-4">
              <InfoPanel
                lng={lng}
                lat={lat}
                zoom={zoom}
                fieldArea={fieldArea > 0 ? fieldArea : totalArea}
              />
            </div>

            {/* Field list in sidebar */}
            <div className="flex-1 px-4 md:px-6 pb-4 overflow-y-auto">
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
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-large border border-white/60 p-6 md:p-8 mx-4">
              <p className="text-base md:text-lg text-neutral-900 font-semibold text-center">
                Please sign in to access the map
              </p>
            </div>
          </div>
        )}

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
            setDestinationCoordinates(null);
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
          destinationCoordinates={destinationCoordinates || undefined}
        />
      )}
    </div>
  );
}
