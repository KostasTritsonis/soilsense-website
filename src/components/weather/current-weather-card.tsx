import React from "react";
import {
  Cloud,
  WaterDrop,
  Thermostat,
  Air,
  Umbrella,
  LocationOn,
  AccessTime,
} from "@mui/icons-material";
import { CurrentWeather } from "@/lib/types";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface CurrentWeatherCardProps {
  currentWeather: CurrentWeather;
}

interface WeatherDetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export default function CurrentWeatherCard({
  currentWeather,
}: CurrentWeatherCardProps) {
  const t = useTranslations();
  if (!currentWeather) {
    return (
      <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-4 md:p-6 text-center">
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          {t("weather.weatherDataNotAvailable")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-4 md:p-5 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 pb-4 md:pb-6">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Cloud
              className="text-blue-600 dark:text-blue-400"
              fontSize="small"
            />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100 truncate">
              {t("weather.currentWeather")}
            </h2>
            <div className="flex items-center gap-2 text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
              <LocationOn className="flex-shrink-0" fontSize="small" />
              <span className="truncate">{currentWeather.location}</span>
            </div>
          </div>
        </div>
        <div className="text-left sm:text-right flex-shrink-0">
          <div className="flex items-center gap-2 text-xs md:text-sm text-neutral-500 dark:text-neutral-400">
            <AccessTime className="flex-shrink-0" fontSize="small" />
            <span className="truncate">
              {t("weather.updated")}: {currentWeather.lastUpdated}
            </span>
          </div>
        </div>
      </div>

      {/* Main Weather Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
        {/* Temperature and Icon */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-50 dark:bg-blue-900/30 rounded-2xl md:rounded-3xl flex items-center justify-center flex-shrink-0">
            <Image
              src={currentWeather.icon}
              alt="Weather icon"
              width={48}
              height={48}
              className="w-12 h-12 md:w-14 md:h-14"
            />
          </div>
          <div className="min-w-0">
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-neutral-100">
              {currentWeather.temperature}
            </h3>
            <p className="text-base md:text-lg lg:text-xl text-neutral-600 dark:text-neutral-400 font-medium truncate">
              {currentWeather.forecast}
            </p>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <WeatherDetailItem
            icon={<Thermostat className="text-red-500" fontSize="small" />}
            label={t("weather.temperature")}
            value={currentWeather.temperature}
          />
          <WeatherDetailItem
            icon={<WaterDrop className="text-blue-500" fontSize="small" />}
            label={t("weather.humidity")}
            value={currentWeather.humidity}
          />
          <WeatherDetailItem
            icon={<Air className="text-gray-500" fontSize="small" />}
            label={t("weather.windSpeed")}
            value={currentWeather.windSpeed}
          />
          <WeatherDetailItem
            icon={<Umbrella className="text-blue-500" fontSize="small" />}
            label={t("weather.precipitation")}
            value={currentWeather.rainfall}
          />
        </div>
      </div>
    </div>
  );
}

const WeatherDetailItem: React.FC<WeatherDetailItemProps> = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-neutral-50/80 dark:bg-neutral-700/80 rounded-xl md:rounded-2xl">
      <div className="flex-shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium truncate">
          {label}
        </p>
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
          {value}
        </p>
      </div>
    </div>
  );
};
