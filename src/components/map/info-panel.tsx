import { MapPin, ZoomIn, Ruler } from "lucide-react";

type InfoPanelProps = {
  lng: number;
  lat: number;
  zoom: number;
  fieldArea: number;
};

export default function InfoPanel({
  lng,
  lat,
  zoom,
  fieldArea,
}: InfoPanelProps) {
  return (
    <div className="p-4 bg-white/90 backdrop-blur-sm border-t border-neutral-200">
      <div className="space-y-3">
        <div className="flex items-center justify-between p-2 bg-neutral-50/80 rounded-xl">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-neutral-500" />
            <span className="text-sm text-neutral-600 font-medium">
              Longitude
            </span>
          </div>
          <span className="text-sm font-semibold text-neutral-900">
            {lng.toFixed(4)}
          </span>
        </div>

        <div className="flex items-center justify-between p-2 bg-neutral-50/80 rounded-xl">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-neutral-500" />
            <span className="text-sm text-neutral-600 font-medium">
              Latitude
            </span>
          </div>
          <span className="text-sm font-semibold text-neutral-900">
            {lat.toFixed(4)}
          </span>
        </div>

        <div className="flex items-center justify-between p-2 bg-neutral-50/80 rounded-xl">
          <div className="flex items-center gap-2">
            <ZoomIn className="w-4 h-4 text-neutral-500" />
            <span className="text-sm text-neutral-600 font-medium">Zoom</span>
          </div>
          <span className="text-sm font-semibold text-neutral-900">
            {zoom.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between p-2 bg-neutral-50/80 rounded-xl">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-neutral-500" />
            <span className="text-sm text-neutral-600 font-medium">Area</span>
          </div>
          <span className="text-sm font-semibold text-neutral-900">
            {fieldArea.toFixed(2)} m²
          </span>
        </div>
      </div>
    </div>
  );
}
