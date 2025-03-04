'use client';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { area } from '@turf/turf';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import "mapbox-gl/dist/mapbox-gl.css";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { deleteField, getFieldById } from '@/actions';
import { useFields } from '@/context/fields-context';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

export const MapSetup = () => {
  
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);
  const [lng, setLng] = useState<number>(24.0036);
  const [lat, setLat] = useState<number>(38.4504);
  const [selectedColor, setSelectedColor] = useState<string>('#FF0000');
  const [fieldArea, setFieldArea] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedColorRef = useRef<string>(selectedColor);
  const initialLngRef = useRef<number>(lng);
  const initialLatRef = useRef<number>(lat);

  const { setFields } = useFields();
  const setFieldsRef = useRef(setFields);

  // Store initial coordinates and setFields in refs to avoid dependency changes
  useEffect(() => {
    initialLngRef.current = lng;
    initialLatRef.current = lat;
    setFieldsRef.current = setFields;
  }, [lng, lat, setFields]);

  // Update the ref whenever selectedColor changes
  useEffect(() => {
    selectedColorRef.current = selectedColor;
  }, [selectedColor]);

  // Initialize map only once
  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [initialLngRef.current, initialLatRef.current],
      zoom: 17.86,
      attributionControl: false,
      cooperativeGestures: true
    });

    drawRef.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
    });

    mapRef.current.on('load', async () => {
      if (!mapRef.current) return;

      // Define the images to load
      const imagesToLoad: Record<string, string> = {
        Wheat: '/wheat.png',
        Tomato: '/tomato.png',
        Olive: '/olive.png',
      };

      // Load and add images
      await Promise.all(
        Object.entries(imagesToLoad).map(async ([name, url]) => {
          const imageName = `${name}-icon`;

          // Skip if the image already exists
          if (mapRef.current?.hasImage(imageName)) {
            console.log(`Image already exists: ${imageName}`);
            return;
          }

          // Load the image
          await new Promise<void>((resolve, reject) => {
            mapRef.current?.loadImage(url, (error, image) => {
              if (error || !image) {
                console.error(`Failed to load image: ${imageName}`, error);
                reject(error);
              } else {
                mapRef.current?.addImage(imageName, image);
                console.log(`Added image: ${imageName}`);
                resolve();
              }
            });
          });
        })
      );
    });

    mapRef.current.addControl(drawRef.current, 'bottom-right');

    mapRef.current.on('move', () => {
      if (!mapRef.current) return;
      setLng(parseFloat(mapRef.current.getCenter().lng.toFixed(4)));
      setLat(parseFloat(mapRef.current.getCenter().lat.toFixed(4)));
    });

    // Handle new field creation
    mapRef.current.on('draw.create', (e: { features: GeoJSON.Feature[] }) => {
      const feature = e.features[0];
      if (!feature) return;
      
      const fieldId = feature.id as string;
      const fArea = area(feature);
      const coordinates = (feature.geometry as GeoJSON.Polygon).coordinates;  
      
      // Use the latest selectedColor from the ref
      const currentColor = selectedColorRef.current;

      // Add the field to your fields array
      setFieldsRef.current((prev) => [...prev, { id: fieldId, color: currentColor, area: fArea, coordinates, label:"", categories:[] }]);

      setFieldArea(fArea);
      setIsModalOpen(true);

      // Add the field layer to the map with the selected color
      mapRef.current?.addLayer({
        id: fieldId,
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
      // Add the border layer
      mapRef.current?.addLayer({
        id: `${fieldId}-border`,
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
      toast.success('Field created successfully!');
    });
    
    mapRef.current.on("draw.update", (e: { features: GeoJSON.Feature[] }) => {
      e.features.forEach((feature) => {
        const fieldId = feature.id as string;
        const updatedCoordinates = (feature.geometry as GeoJSON.Polygon).coordinates;
        const updatedArea = area(feature);

        setFieldsRef.current((prevFields) =>
          prevFields.map((field) =>
            field.id === fieldId
              ? { ...field, coordinates: updatedCoordinates, area: updatedArea } 
              : field
          )
        );

        // ✅ Update the field fill in real-time
        if (mapRef.current?.getSource(fieldId)) {
          (mapRef.current.getSource(fieldId) as mapboxgl.GeoJSONSource).setData(feature);
        }

        const labelLayerId = `${fieldId}-label`;
        if (mapRef.current?.getSource(labelLayerId)) {
          (mapRef.current.getSource(labelLayerId) as mapboxgl.GeoJSONSource).setData(feature);
        }
    
        // ✅ Update the field border in real-time
        const borderLayerId = `${fieldId}-border`;
        if (mapRef.current?.getSource(borderLayerId)) {
          (mapRef.current.getSource(borderLayerId) as mapboxgl.GeoJSONSource).setData(feature);
        }

        const iconLayerId = `${fieldId}-icon`;
        if (mapRef.current?.getSource(iconLayerId)) {
          (mapRef.current.getSource(iconLayerId) as mapboxgl.GeoJSONSource).setData(feature);
        }
      });
    });

    // Handle field deletion
    mapRef.current.on('draw.delete', (e: { features: GeoJSON.Feature[] }) => {
      const deletedIds = e.features.map((f) => f.id as string);

      // Remove the custom layer for each deleted field
      deletedIds.map((id) => {
        if (mapRef.current?.getLayer(id)) {
          mapRef.current.removeLayer(id);
        }
        const labelLayerId = `${id}-label`;
        if (mapRef.current?.getLayer(labelLayerId)) {
          mapRef.current.removeLayer(labelLayerId);
        }
        
        const borderLayerId = `${id}-border`;
        if (mapRef.current?.getLayer(borderLayerId)) {
          mapRef.current.removeLayer(borderLayerId);
        }

        const iconLayerId = `${id}-icon`;
        if (mapRef.current?.getLayer(iconLayerId)) {
          mapRef.current.removeLayer(iconLayerId);
        }
      });

      deletedIds.map((id) => {
        if (mapRef.current?.getSource(id)) {
          mapRef.current.removeSource(id);
        }
        const labelLayerId = `${id}-label`;
        if (mapRef.current?.getSource(labelLayerId)) {
          mapRef.current.removeSource(labelLayerId);
        }
        const borderLayerId = `${id}-border`;
        if (mapRef.current?.getSource(borderLayerId)) {
          mapRef.current.removeSource(borderLayerId);
        }
        const iconLayerId = `${id}-icon`;
        if (mapRef.current?.getSource(iconLayerId)) {
          mapRef.current.removeSource(iconLayerId);
        }
      });

      // Update the fields state
      setFieldsRef.current((prev) => prev.filter((p) => !deletedIds.includes(p.id)));

      const existingPolygon = getFieldById(deletedIds[0]);
      if (existingPolygon != null) {
        deleteField(deletedIds[0]);
      }
      
      setFieldArea(0);
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add Geolocation Control (User Location)
    mapRef.current.addControl(new mapboxgl.GeolocateControl({ 
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true
    }), "top-left");

    // Add Scale Control
    mapRef.current.addControl(new mapboxgl.ScaleControl({ maxWidth: 100, unit: 'metric' }));

    // Add Fullscreen Control
    mapRef.current.addControl(new mapboxgl.FullscreenControl());

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Empty dependency array with eslint-disable comment

  return {
    mapContainer,
    mapRef,
    drawRef,
    lng,
    lat,
    selectedColor,
    fieldArea,
    isModalOpen,
    setSelectedColor,
    setIsModalOpen,
  };
};