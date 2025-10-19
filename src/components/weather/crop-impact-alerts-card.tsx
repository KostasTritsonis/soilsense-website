import { CurrentWeather, ForecastDay } from "@/lib/types";
import React from "react";
import {
  Sprout,
  Thermometer,
  Droplets,
  AlertTriangle,
  Info,
} from "lucide-react";

export interface WeatherAlert {
  type: "warning" | "info";
  message: string;
}

interface CropImpactAlertsCardProps {
  currentWeather: CurrentWeather;
  forecast: ForecastDay[];
  alerts: WeatherAlert[];
}

export default function CropImpactAlertsCard({
  currentWeather,
  forecast,
  alerts,
}: CropImpactAlertsCardProps) {
  if (!currentWeather) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 p-6 text-center">
        <p className="text-neutral-500">Weather data not available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-6">
        <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center">
          <Sprout className="w-5 h-5 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-neutral-900">
          Crop Impact & Weather Alerts
        </h2>
      </div>

      <div className="space-y-6">
        {/* Weather Alerts Section */}
        <div>
          <div className="flex items-center gap-2 pb-3">
            <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900">
              Weather Alerts
            </h3>
          </div>

          {alerts.length === 0 ? (
            <div className="text-center py-6 bg-green-50 rounded-2xl border border-green-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Info className="w-5 h-5 text-green-600" />
                <p className="text-green-700 font-medium">
                  No weather alerts at this time
                </p>
              </div>
              <p className="text-sm text-green-600">
                All conditions are favorable
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-2xl border ${
                    alert.type === "warning"
                      ? "bg-orange-50 border-orange-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {alert.type === "warning" ? (
                      <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    )}
                    <p
                      className={`text-sm font-medium ${
                        alert.type === "warning"
                          ? "text-orange-800"
                          : "text-blue-800"
                      }`}
                    >
                      {alert.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Crop Impact Analysis Section */}
        <div>
          <div className="flex items-center gap-2 pb-3">
            <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
              <Sprout className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900">
              Crop Impact Analysis
            </h3>
          </div>

          <div className="space-y-4">
            <CropImpactItem
              cropName="Corn (Field 3)"
              currentWeather={currentWeather}
              forecast={forecast}
              optimalTempRange={[18, 25]}
              highHumidityThreshold={70}
            />

            <CropImpactItem
              cropName="Wheat (Field 1)"
              currentWeather={currentWeather}
              forecast={forecast}
              optimalTempRange={[15, 24]}
              highHumidityThreshold={75}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface CropImpactItemProps {
  cropName: string;
  currentWeather: CurrentWeather;
  forecast: ForecastDay[];
  optimalTempRange: [number, number];
  highHumidityThreshold: number;
}

const CropImpactItem: React.FC<CropImpactItemProps> = ({
  cropName,
  currentWeather,
  forecast,
  optimalTempRange,
  highHumidityThreshold,
}) => {
  const currentTemp = parseInt(currentWeather.temperature);
  const currentHumidity = parseInt(currentWeather.humidity);
  const isOptimalTemp =
    currentTemp >= optimalTempRange[0] && currentTemp <= optimalTempRange[1];
  const isHighHumidity = currentHumidity > highHumidityThreshold;
  const heavyRainExpected = forecast
    .slice(0, 3)
    .some((day) => parseFloat(day.rainChance) > 60);

  return (
    <div className="p-4 bg-neutral-50/80 rounded-2xl border border-neutral-100">
      <h4 className="font-semibold text-neutral-900 text-sm pb-3">
        {cropName}
      </h4>

      <div className="space-y-3">
        {/* Temperature Status */}
        <div className="flex items-center gap-3">
          <Thermometer className="w-4 h-4 text-red-500" />
          <div className="flex-1">
            <p className="text-xs text-neutral-600">Temperature</p>
            <p className="text-sm font-medium text-neutral-900">
              {currentWeather.temperature}°C (Optimal: {optimalTempRange[0]}-
              {optimalTempRange[1]}°C)
            </p>
          </div>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              isOptimalTemp
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {isOptimalTemp ? "Optimal" : "Moderate"}
          </div>
        </div>

        {/* Humidity Status */}
        <div className="flex items-center gap-3">
          <Droplets className="w-4 h-4 text-blue-500" />
          <div className="flex-1">
            <p className="text-xs text-neutral-600">Humidity</p>
            <p className="text-sm font-medium text-neutral-900">
              {currentWeather.humidity}%
            </p>
          </div>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              isHighHumidity
                ? "bg-orange-100 text-orange-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {isHighHumidity ? "High" : "Normal"}
          </div>
        </div>

        {/* Recommendations */}
        {(isHighHumidity || heavyRainExpected) && (
          <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
            <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-orange-800">
              {isHighHumidity && (
                <p className="pb-1">
                  Monitor for fungal diseases due to high humidity
                </p>
              )}
              {heavyRainExpected && (
                <p>Heavy rain expected - consider protective measures</p>
              )}
            </div>
          </div>
        )}

        {!isHighHumidity && !heavyRainExpected && (
          <div className="text-xs text-green-700 font-medium">
            ✓ Conditions are favorable for growth
          </div>
        )}
      </div>
    </div>
  );
};
