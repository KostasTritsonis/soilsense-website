"use client";
import { useState } from "react";
import { RouteInfo, RouteStep } from "@/lib/directions";
import { X, Navigation, Clock, MapPin } from "lucide-react";

interface DirectionsPanelProps {
  routeInfo: RouteInfo | null;
  onClose: () => void;
  startPoint: [number, number] | null;
  destination: string;
}

export default function DirectionsPanel({
  routeInfo,
  onClose,
  startPoint,
  destination,
}: DirectionsPanelProps) {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  if (!routeInfo) {
    return null;
  }

  const formatStepDistance = (meters: number): string => {
    if (meters < 100) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const getStepIcon = (maneuverType: string) => {
    switch (maneuverType) {
      case "turn":
        return "↪️";
      case "merge":
        return "↗️";
      case "depart":
        return "🚀";
      case "arrive":
        return "📍";
      case "roundabout":
        return "🔄";
      default:
        return "➡️";
    }
  };

  return (
    <div className="absolute top-4 right-14 w-80 max-h-[80vh] bg-[#2A3330] text-white rounded-lg shadow-lg z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-[#374151] p-4 border-b border-zinc-700">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Directions</h3>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Route Summary */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center space-x-2">
            <MapPin size={16} className="text-green-400" />
            <span className="text-sm">To: {destination}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Navigation size={16} className="text-blue-400" />
              <span className="text-sm font-medium">
                {routeInfo.distanceText}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={16} className="text-yellow-400" />
              <span className="text-sm font-medium">
                {routeInfo.durationText}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Route Steps */}
      <div className="max-h-96 overflow-y-auto">
        <div className="p-4 space-y-3">
          {routeInfo.steps.map((step: RouteStep, index: number) => (
            <div
              key={index}
              className={`flex items-start space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                selectedStep === index
                  ? "bg-[#1F2937] border border-zinc-600"
                  : "hover:bg-[#374151]"
              }`}
              onClick={() =>
                setSelectedStep(selectedStep === index ? null : index)
              }
            >
              {/* Step Number */}
              <div className="flex-shrink-0 w-6 h-6 bg-[#8B4513] text-white rounded-full flex items-center justify-center text-xs font-medium">
                {index + 1}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-lg">
                    {getStepIcon(step.maneuver.type)}
                  </span>
                  <p className="text-sm font-medium text-white">
                    {step.instruction}
                  </p>
                </div>

                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <span>{formatStepDistance(step.distance)}</span>
                  <span>{Math.round(step.duration / 60)} min</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-zinc-700 p-4">
        <div className="flex space-x-2">
          <button
            onClick={() => {
              // Open in external navigation app
              if (startPoint) {
                const url = `https://www.google.com/maps/dir/${startPoint[1]},${startPoint[0]}/${destination}`;
                window.open(url, "_blank");
              }
            }}
            className="flex-1 bg-[#2A9D8F] text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-[#258A7D] transition-colors"
          >
            Open in Maps
          </button>
          <button
            onClick={() => {
              // Copy route info to clipboard
              const routeText = `Route to ${destination}: ${routeInfo.distanceText}, ${routeInfo.durationText}`;
              navigator.clipboard.writeText(routeText);
            }}
            className="px-4 py-2 border border-zinc-600 rounded-lg text-sm font-medium hover:bg-[#374151] transition-colors"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
