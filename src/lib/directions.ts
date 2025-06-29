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

export async function getDirections(start: LngLatLike, end: LngLatLike) {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("Mapbox access token is not set.");
  }

  const startCoords = toCoordinates(start);
  const endCoords = toCoordinates(end);

  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?geometries=geojson&access_token=${accessToken}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.code !== "Ok") {
    throw new Error(data.message || "Error fetching directions.");
  }

  return data.routes[0].geometry;
}
