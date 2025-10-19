"use client";
import { useState } from "react";
import { RouteInfo, RouteStep } from "@/lib/directions";
import {
  X,
  Navigation,
  Clock,
  MapPin,
  Copy,
  ExternalLink,
  ArrowRight,
  ArrowUpRight,
  Target,
  RefreshCw,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface DirectionsPanelProps {
  routeInfo: RouteInfo | null;
  onClose: () => void;
  startPoint: [number, number] | null;
  destination: string;
  destinationCoordinates?: [number, number];
}

export default function DirectionsPanel({
  routeInfo,
  onClose,
  startPoint,
  destination,
  destinationCoordinates,
}: DirectionsPanelProps) {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const t = useTranslations();

  if (!routeInfo) {
    return null;
  }

  const formatStepDistance = (meters: number): string => {
    if (meters < 100) {
      return `${Math.round(meters)} ${t("units.meters")}`;
    }
    return `${(meters / 1000).toFixed(1)} ${t("units.kilometers")}`;
  };

  const formatCoordinates = (coordinates: [number, number]): string => {
    const [lat, lng] = coordinates;
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  const getStepIcon = (maneuverType: string) => {
    switch (maneuverType) {
      case "turn":
        return <ArrowRight className="w-4 h-4" />;
      case "merge":
        return <ArrowUpRight className="w-4 h-4" />;
      case "depart":
        return <Navigation className="w-4 h-4" />;
      case "arrive":
        return <Target className="w-4 h-4" />;
      case "roundabout":
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <ArrowRight className="w-4 h-4" />;
    }
  };

  return (
    <div className="absolute top-4 left-4 right-4 md:top-4 md:right-14 md:left-auto w-auto md:w-80 max-h-[85vh] md:max-h-[80vh] bg-white/95 backdrop-blur-sm rounded-3xl shadow-large border border-white/60 z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-4 md:p-6 border-b border-neutral-200">
        <div className="flex justify-between items-center pb-3 md:pb-4">
          <h3 className="text-lg md:text-xl font-bold text-neutral-900">
            {t("fields.directions")}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/80 hover:bg-white rounded-xl flex items-center justify-center transition-colors shadow-soft flex-shrink-0"
          >
            <X className="w-4 h-4 text-neutral-600" />
          </button>
        </div>

        {/* Route Summary */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-white/80 rounded-2xl">
            <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-neutral-600 font-medium">
                {t("fields.destination")}
              </p>
              <p className="text-sm font-semibold text-neutral-900 truncate">
                {destinationCoordinates
                  ? formatCoordinates(destinationCoordinates)
                  : destination}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 bg-white/80 rounded-2xl">
              <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Navigation className="w-4 h-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-neutral-600 font-medium">
                  {t("fields.distance")}
                </p>
                <p className="text-sm font-semibold text-neutral-900">
                  {routeInfo.distanceText}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white/80 rounded-2xl">
              <div className="w-8 h-8 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-neutral-600 font-medium">
                  {t("fields.duration")}
                </p>
                <p className="text-sm font-semibold text-neutral-900">
                  {routeInfo.durationText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Route Steps */}
      <div className="max-h-64 md:max-h-96 overflow-y-auto">
        <div className="p-4 md:p-6 space-y-3">
          {routeInfo.steps.map((step: RouteStep, index: number) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                selectedStep === index
                  ? "bg-primary-50 border-2 border-primary-200 shadow-medium"
                  : "bg-neutral-50/80 hover:bg-neutral-100/80"
              }`}
              onClick={() =>
                setSelectedStep(selectedStep === index ? null : index)
              }
            >
              {/* Step Number */}
              <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-xl flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 pb-2">
                  <div className="text-primary-600 flex-shrink-0">
                    {getStepIcon(step.maneuver.type)}
                  </div>
                  <p className="text-sm font-semibold text-neutral-900">
                    {step.instruction}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Navigation className="w-3 h-3" />
                    {formatStepDistance(step.distance)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {Math.round(step.duration / 60)} {t("time.minutes")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-neutral-200 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              if (startPoint) {
                const destinationParam = destinationCoordinates
                  ? `${destinationCoordinates[1]},${destinationCoordinates[0]}`
                  : destination;
                const url = `https://www.google.com/maps/dir/${startPoint[1]},${startPoint[0]}/${destinationParam}`;
                window.open(url, "_blank");
              }
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-2xl text-sm font-semibold transition-colors shadow-soft hover:shadow-medium"
          >
            <ExternalLink className="w-4 h-4" />
            {t("fields.openInMaps")}
          </button>
          <button
            onClick={() => {
              const routeText = `Route to ${destination}: ${routeInfo.distanceText}, ${routeInfo.durationText}`;
              navigator.clipboard.writeText(routeText);
            }}
            className="flex items-center justify-center gap-2 px-4 py-3 border border-neutral-300 rounded-2xl text-sm font-semibold hover:bg-neutral-50 transition-colors"
          >
            <Copy className="w-4 h-4" />
            {t("common.copy")}
          </button>
        </div>
      </div>
    </div>
  );
}
