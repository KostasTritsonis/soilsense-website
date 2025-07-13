import { LngLatLike } from "mapbox-gl";

function toCoordinates(lngLat: LngLatLike): [number, number] {
  if (Array.isArray(lngLat)) {
    return lngLat as [number, number];
  }
  if ("lng" in lngLat && "lat" in lngLat) {
    return [lngLat.lng, lngLat.lat];
  }
  if ("lon" in lngLat && "lat" in lngLat) {
    return [lngLat.lon, lngLat.lat];
  }
  throw new Error("Invalid LngLatLike object");
}

interface GeoJSONGeometry {
  type: string;
  coordinates: number[][];
}

export interface RouteInfo {
  geometry: GeoJSONGeometry;
  distance: number; // in meters
  duration: number; // in seconds
  distanceText: string; // formatted distance (e.g., "2.5 km")
  durationText: string; // formatted duration (e.g., "15 min")
  steps: RouteStep[];
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  maneuver: {
    type: string;
    instruction: string;
    bearing_after: number;
    bearing_before: number;
  };
}

interface MapboxStep {
  maneuver: {
    type: string;
    instruction: string;
    bearing_after: number;
    bearing_before: number;
  };
  distance: number;
  duration: number;
}

function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${remainingMinutes} min`;
}

export async function getDirections(
  start: LngLatLike,
  end: LngLatLike
): Promise<RouteInfo> {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("Mapbox access token is not set.");
  }

  const startCoords = toCoordinates(start);
  const endCoords = toCoordinates(end);

  // Enhanced URL to get detailed route information
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?geometries=geojson&steps=true&overview=full&access_token=${accessToken}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.code !== "Ok") {
    throw new Error(data.message || "Error fetching directions.");
  }

  const route = data.routes[0];
  const leg = route.legs[0];

  return {
    geometry: route.geometry as GeoJSONGeometry,
    distance: leg.distance,
    duration: leg.duration,
    distanceText: formatDistance(leg.distance),
    durationText: formatDuration(leg.duration),
    steps: leg.steps.map((step: MapboxStep) => ({
      instruction: step.maneuver.instruction,
      distance: step.distance,
      duration: step.duration,
      maneuver: {
        type: step.maneuver.type,
        instruction: step.maneuver.instruction,
        bearing_after: step.maneuver.bearing_after,
        bearing_before: step.maneuver.bearing_before,
      },
    })),
  };
}

// Legacy function for backward compatibility
export async function getDirectionsGeometry(
  start: LngLatLike,
  end: LngLatLike
) {
  const routeInfo = await getDirections(start, end);
  return routeInfo.geometry;
}
