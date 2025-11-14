import { CurrentWeather, ForecastDay } from "@/lib/types";
import React from "react";
import { Sprout, Thermometer, Droplets, AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

interface CropImpactCardProps {
  currentWeather: CurrentWeather;
  forecast: ForecastDay[];
}

export default function CropImpactCard({
  currentWeather,
  forecast,
}: CropImpactCardProps) {
  const t = useTranslations();
  if (!currentWeather) {
    return (
      <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-3 sm:p-4 md:p-6 text-center">
        <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm">
          {t("weather.weatherDataNotAvailable")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-3 sm:p-4 md:p-6">
      <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 md:pb-6">
        <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-green-100 dark:bg-green-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
          <Sprout className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100 truncate">
          {t("weather.cropImpactAnalysis")}
        </h2>
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
  const t = useTranslations();
  const currentTemp = parseInt(currentWeather.temperature);
  const currentHumidity = parseInt(currentWeather.humidity);
  const isOptimalTemp =
    currentTemp >= optimalTempRange[0] && currentTemp <= optimalTempRange[1];
  const isHighHumidity = currentHumidity > highHumidityThreshold;
  const heavyRainExpected = forecast
    .slice(0, 3)
    .some((day) => parseFloat(day.rainChance) > 60);

  return (
    <div className="p-2.5 sm:p-3 md:p-4 bg-neutral-50/80 dark:bg-neutral-700/80 rounded-lg sm:rounded-xl md:rounded-2xl border border-neutral-100 dark:border-neutral-600">
      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm pb-2 sm:pb-3 truncate">
        {cropName}
      </h3>

      <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
        {/* Temperature Status */}
        <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
          <Thermometer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 dark:text-red-300 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400">
              {t("weather.temperature")}
            </p>
            <p className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
              {currentWeather.temperature}°C (
              {t("weather.optimalTempRange", {
                min: optimalTempRange[0],
                max: optimalTempRange[1],
              })}
              )
            </p>
          </div>
          <div
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium flex-shrink-0 ${
              isOptimalTemp
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
            }`}
          >
            {isOptimalTemp ? t("weather.optimal") : t("weather.moderate")}
          </div>
        </div>

        {/* Humidity Status */}
        <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
          <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 dark:text-blue-300 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400">
              {t("weather.humidity")}
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
            {isHighHumidity ? t("weather.high") : t("weather.normal")}
          </div>
        </div>

        {/* Recommendations */}
        {(isHighHumidity || heavyRainExpected) && (
          <div className="flex items-start gap-2 sm:gap-2.5 md:gap-3 p-2 sm:p-2.5 md:p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg sm:rounded-xl border border-orange-100 dark:border-orange-600">
            <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
            <div className="text-[10px] sm:text-xs text-orange-800 dark:text-orange-300">
              {isHighHumidity && (
                <p className="pb-0.5 sm:pb-1">
                  {t("weather.monitorFungalDiseases")}
                </p>
              )}
              {heavyRainExpected && <p>{t("weather.heavyRainExpected")}</p>}
            </div>
          </div>
        )}

        {!isHighHumidity && !heavyRainExpected && (
          <div className="text-[10px] sm:text-xs text-green-700 dark:text-green-300 font-medium">
            {t("weather.conditionsFavorable")}
          </div>
        )}
      </div>
    </div>
  );
};
