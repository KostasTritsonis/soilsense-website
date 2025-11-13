import { MapPin, ZoomIn, Ruler, LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

type InfoRowProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
};

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-center gap-2 p-2 bg-neutral-50/80 dark:bg-neutral-700/80 rounded-xl">
      <Icon className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
      <span className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
        {label}
      </span>
      <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-300 flex-1 text-right">
        {value}
      </span>
    </div>
  );
}

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
    <div className="p-3 bg-white/95 dark:bg-neutral-800/90 backdrop-blur-sm border border-white/60 dark:border-neutral-700/60 rounded-2xl">
      <div className="space-y-2">
        <InfoRow
          icon={MapPin}
          label={t("fields.longitude")}
          value={lng.toFixed(4)}
        />

        <InfoRow
          icon={MapPin}
          label={t("fields.latitude")}
          value={lat.toFixed(4)}
        />

        <InfoRow
          icon={ZoomIn}
          label={t("fields.zoom")}
          value={zoom.toFixed(2)}
        />

        <InfoRow
          icon={Ruler}
          label={t("fields.area")}
          value={`${fieldArea.toFixed(2)} ${t("units.squareMeters")}`}
        />
      </div>
    </div>
  );
}
