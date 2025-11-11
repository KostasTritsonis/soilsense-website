import { MapPin, ZoomIn, Ruler } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations();
  return (
    <div className="p-4 bg-white/95 backdrop-blur-sm border border-white/60 rounded-2xl shadow-large">
      <div className="space-y-3">
        <div className="flex items-center justify-between p-2 bg-neutral-50/80 rounded-xl">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-neutral-500" />
            <span className="text-sm text-neutral-600 font-medium">
              {t("fields.longitude")}
            </span>
            <span className="text-sm font-semibold text-neutral-900">
              {lng.toFixed(4)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-2 bg-neutral-50/80 rounded-xl">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-neutral-500" />
            <span className="text-sm text-neutral-600 font-medium">
              {t("fields.latitude")}
            </span>
          </div>
          <span className="text-sm font-semibold text-neutral-900">
            {lat.toFixed(4)}
          </span>
        </div>

        <div className="flex items-center justify-between p-2 bg-neutral-50/80 rounded-xl">
          <div className="flex items-center gap-2">
            <ZoomIn className="w-4 h-4 text-neutral-500" />
            <span className="text-sm text-neutral-600 font-medium">
              {t("fields.zoom")}
            </span>
          </div>
          <span className="text-sm font-semibold text-neutral-900">
            {zoom.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between p-2 bg-neutral-50/80 rounded-xl">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-neutral-500" />
            <span className="text-sm text-neutral-600 font-medium">
              {t("fields.area")}
            </span>
          </div>
          <span className="text-sm font-semibold text-neutral-900">
            {fieldArea.toFixed(2)} {t("units.squareMeters")}
          </span>
        </div>
      </div>
    </div>
  );
}
