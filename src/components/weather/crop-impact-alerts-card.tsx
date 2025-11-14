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
      <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-3 sm:p-4 md:p-6 text-center">
        <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm">
          Weather data not available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 md:pb-6">
        <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-green-100 dark:bg-green-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
          <Sprout className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
        </div>
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100 truncate">
          Crop Impact & Weather Alerts
        </h2>
      </div>

      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        {/* Weather Alerts Section */}
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2 pb-2 sm:pb-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-100 dark:bg-orange-900/30 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 truncate">
              Weather Alerts
            </h3>
          </div>

          {alerts.length === 0 ? (
            <div className="text-center py-3 sm:py-4 md:py-6 bg-green-50 dark:bg-green-900/30 rounded-lg sm:rounded-xl border border-green-100 dark:border-green-600">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                <p className="text-green-700 dark:text-green-300 font-medium text-xs sm:text-sm">
                  No weather alerts at this time
                </p>
              </div>
              <p className="text-xs sm:text-sm text-green-600 dark:text-green-300">
                All conditions are favorable
              </p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl border ${
                    alert.type === "warning"
                      ? "bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-600"
                      : "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-600"
                  }`}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    {alert.type === "warning" ? (
                      <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-300 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-300 flex-shrink-0 mt-0.5" />
                    )}
                    <p
                      className={`text-xs sm:text-sm font-medium ${
                        alert.type === "warning"
                          ? "text-orange-800 dark:text-orange-300"
                          : "text-blue-800 dark:text-blue-300"
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
          <div className="flex items-center gap-1.5 sm:gap-2 pb-2 sm:pb-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 dark:bg-green-900/30 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
              <Sprout className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 truncate">
              Crop Impact Analysis
            </h3>
          </div>

          <div className="space-y-3 sm:space-y-4">
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
    <div className="p-2.5 sm:p-3 md:p-4 bg-neutral-50/80 dark:bg-neutral-700/80 rounded-lg sm:rounded-xl border border-neutral-100 dark:border-neutral-600">
      <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm pb-2 sm:pb-3 truncate">
        {cropName}
      </h4>

      <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
        {/* Temperature Status */}
        <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
          <Thermometer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 dark:text-red-300 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400">
              Temperature
            </p>
            <p className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
              {currentWeather.temperature}°C (Optimal: {optimalTempRange[0]}-
              {optimalTempRange[1]}°C)
            </p>
          </div>
          <div
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium flex-shrink-0 ${
              isOptimalTemp
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
            }`}
          >
            {isOptimalTemp ? "Optimal" : "Moderate"}
          </div>
        </div>

        {/* Humidity Status */}
        <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
          <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 dark:text-blue-300 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400">
              Humidity
            </p>
            <p className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {currentWeather.humidity}%
            </p>
          </div>
          <div
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium flex-shrink-0 ${
              isHighHumidity
                ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
            }`}
          >
            {isHighHumidity ? "High" : "Normal"}
          </div>
        </div>

        {/* Recommendations */}
        {(isHighHumidity || heavyRainExpected) && (
          <div className="flex items-start gap-2 sm:gap-2.5 md:gap-3 p-2 sm:p-2.5 md:p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg sm:rounded-xl border border-orange-100 dark:border-orange-600">
            <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="text-[10px] sm:text-xs text-orange-800 dark:text-orange-300">
              {isHighHumidity && (
                <p className="pb-0.5 sm:pb-1">
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
          <div className="text-[10px] sm:text-xs text-green-700 dark:text-green-300 font-medium">
            ✓ Conditions are favorable for growth
          </div>
        )}
      </div>
    </div>
  );
};
