'use client';
import { useState, useRef,useEffect  } from 'react';
import { toast } from 'react-toastify';
import { createPolygon, getPolygons } from '@/actions/actions';
import { area } from '@turf/turf';
import type { Polygon } from './types';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;


type handlerProps = {
  mapRef: React.RefObject<mapboxgl.Map | null>;
  drawRef: React.RefObject<MapboxDraw | null>;
  polygons: Polygon[];
  setPolygons: React.Dispatch<React.SetStateAction<Polygon[]>>;
};

export const useMapHandlers = ({mapRef, drawRef,polygons,setPolygons}: handlerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = () => {
      if (polygons.length > 0 && !window.confirm('Are you sure you want to reset the map? All unsaved changes will be lost.')) {
        return;
      }
  
      if (drawRef.current && mapRef.current) {
        drawRef.current.deleteAll();
  
        polygons.map((polygon) => {
          if (mapRef.current?.getLayer(polygon.id)) {
            mapRef.current.removeLayer(polygon.id);
          }
          if (mapRef.current?.getSource(polygon.id)) {
            mapRef.current.removeSource(polygon.id);
          }
          const labelLayerId = `${polygon.id}-label`;
          if (mapRef.current?.getLayer(labelLayerId)) {
            mapRef.current.removeLayer(labelLayerId);
          }
          if (mapRef.current?.getSource(labelLayerId)) {
            mapRef.current.removeSource(labelLayerId);
          }
          const borderLayerId = `${polygon.id}-border`;
          if (mapRef.current?.getLayer(borderLayerId)) {
            mapRef.current.removeLayer(borderLayerId);
          }
          if (mapRef.current?.getSource(borderLayerId)) {
            mapRef.current.removeSource(borderLayerId);
          }
        });
  
        setPolygons([]);
        toast.info('Map reset successfully!');
      }
    };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const results = await Promise.all(polygons.map((polygon) => createPolygon(polygon)));
      const failed = results.filter((res) => !res.success);

      if (failed.length > 0) {
        throw new Error(`Failed to save ${failed.length} polygons.`);
      }
      toast.success('All polygons saved successfully!');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save polygons.');
    } finally {
      setIsSaving(false);
    }
  };

  const loadPolygons = async () => {
    try {
      setIsLoading(true);
      const dbPolygons = await getPolygons();

      if (!dbPolygons || dbPolygons.length === 0) {
        toast.info('No polygons found in database.');
        return;
      }

      // Clear existing polygons before loading new ones
      handleReset();
      setPolygons(dbPolygons);

      dbPolygons.forEach(({ id, color, coordinates, label }) => {
        let lng = 0;
        let lat = 0;

        coordinates[0].forEach((point) => {
          lng += point[0];
          lat += point[1];
        });
        const center = [lng / coordinates[0].length, lat / coordinates[0].length];

        if (!mapRef.current) return;

        if (mapRef.current.getSource(id)) return;

        mapRef.current.addSource(id, {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: { type: 'Polygon', coordinates },
              properties: { color },
            },
        });

        mapRef.current.addLayer({
            id,
            type: 'fill',
            source: id,
            paint: {
              'fill-color': color,
              'fill-opacity': 0.5,
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
                  properties: { label },
              },
            },
            layout: {
              'text-field': label || 'Unnamed',
              'text-size': 14,
              'text-anchor': 'center',
            },
            paint: {
              'text-color': '#ffffff',
              'text-halo-color': '#000000',
              'text-halo-width': 1.5,
            },
        });

        // Add the border layer
        mapRef.current.addLayer({
          id: `${id}-border`,
          type: "line",
          source: id,
          paint: {
            "line-color": color,
            "line-width": 2, // Border thickness
          },
        });
      });
      toast.success('Polygons loaded successfully!');
    } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load polygons.');
    } finally {
        setIsLoading(false);
    }
  };
  return {
    isLoading,
    isSaving,
    error,
    handleReset,
    handleSave,
    loadPolygons
  };
};



export const useMapSetup = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);
  const [lng, setLng] = useState<number>(24.0036);
  const [lat, setLat] = useState<number>(38.4504);
  const [zoom, setZoom] = useState<number>(17.86);
  const [polygons, setPolygons] = useState<Polygon[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('#FF0000');
  const [polygonArea, setPolygonArea] = useState<number | null>(null);
 

  const selectedColorRef = useRef<string>(selectedColor);
  
    // Update the ref whenever selectedColor changes
  useEffect(() => {
    selectedColorRef.current = selectedColor;
  }, [selectedColor]);

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [lng, lat],
      zoom: zoom,
      attributionControl: false,
    });

    drawRef.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
    });

    mapRef.current.addControl(drawRef.current);

    mapRef.current.on('move', () => {
      if (!mapRef.current) return;
      setLng(parseFloat(mapRef.current.getCenter().lng.toFixed(4)));
      setLat(parseFloat(mapRef.current.getCenter().lat.toFixed(4)));
      setZoom(parseFloat(mapRef.current.getZoom().toFixed(2)));
    });

    // Handle new polygon creation
    mapRef.current.on('draw.create', (e: { features: GeoJSON.Feature[] }) => {
      const feature = e.features[0];
      if (!feature) return;

      const polygonId = feature.id as string;
      const polyArea = area(feature);
      const coordinates = (feature.geometry as GeoJSON.Polygon).coordinates;
      const label = prompt('Enter a label for this polygon:') || `Polygon ${polygons.length + 1}`;

      // Use the latest selectedColor from the ref
      const currentColor = selectedColorRef.current;

      // Add the new polygon with the currently selected color
      setPolygons((prev) => [...prev, { id: polygonId, color: currentColor, area: polyArea, coordinates, label }]);
      setPolygonArea(polyArea);

      // Add the polygon layer to the map with the selected color
      mapRef.current?.addLayer({
        id: polygonId,
        type: 'fill',
        source: {
          type: 'geojson',
          data: feature,
        },
        paint: {
          'fill-color': currentColor,
          'fill-opacity': 0.5,
        },
      });

      mapRef.current?.addLayer({
        id: `${polygonId}-label`,
        type: 'symbol',
        source: {
          type: 'geojson',
          data: feature,
        },
        layout: {
          'text-field': label,
          'text-size': 14,
          'text-anchor': 'center',
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#000000',
          'text-halo-width': 1.5,
        },
      });

      // Add the border layer
      mapRef.current?.addLayer({
        id: `${polygonId}-border`,
        type: "line",
        source: {
          type: "geojson",
          data: feature,
        },
        paint: {
          "line-color": currentColor,
          "line-width": 2, // Border thickness
        },
      });

      toast.success('Polygon created successfully!');
    });

    mapRef.current.on('draw.update', (e: { features: GeoJSON.Feature[] }) => {
      e.features.forEach((feature) => {
        const polygonId = feature.id as string;
        const updatedCoordinates = (feature.geometry as GeoJSON.Polygon).coordinates;
    
        // Find the polygon in state to get the correct color
        setPolygons((prevPolygons) => {
          return prevPolygons.map((polygon) => {
            if (polygon.id === polygonId) {
              // Update the coordinates and area
              const newArea = area(feature);
              return { ...polygon, coordinates: updatedCoordinates, area: newArea };
            }
            return polygon;
          });
        });
      });
    });

    // Handle polygon deletion
    mapRef.current.on('draw.delete', (e: { features: GeoJSON.Feature[] }) => {
      const deletedIds = e.features.map((f) => f.id as string);

      // Remove the custom layer for each deleted polygon
      deletedIds.forEach((id) => {
        if (mapRef.current?.getLayer(id)) {
          mapRef.current.removeLayer(id);
        }
        if (mapRef.current?.getSource(id)) {
          mapRef.current.removeSource(id);
        }
        const labelLayerId = `${id}-label`;
        if (mapRef.current?.getLayer(labelLayerId)) {
          mapRef.current.removeLayer(labelLayerId);
        }
        if (mapRef.current?.getSource(labelLayerId)) {
          mapRef.current.removeSource(labelLayerId);
        }
        const borderLayerId = `${id}-border`;
        if (mapRef.current?.getLayer(borderLayerId)) {
          mapRef.current.removeLayer(borderLayerId);
        }
        if (mapRef.current?.getSource(borderLayerId)) {
          mapRef.current.removeSource(borderLayerId);
        }
      });

      // Update the polygons state
      setPolygons((prev) => prev.filter((p) => !deletedIds.includes(p.id)));
      setPolygonArea((prev) => prev && polygonArea ? polygonArea - prev : null);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return {
    mapContainer,
    polygons,
    mapRef,
    drawRef,
    lng,
    lat,
    zoom,
    polygonArea,
    selectedColor,
    setPolygons,
    setSelectedColor
  };
};

