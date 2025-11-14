import React from "react";
import {
  Cloud,
  Droplets,
  ThermometerSun,
  Wind,
  Umbrella,
  MapPin,
  Clock,
} from "lucide-react";
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
      <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-3 sm:p-4 md:p-6 text-center">
        <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm">
          {t("weather.weatherDataNotAvailable")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-3 sm:p-4 md:p-5 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 md:gap-4 pb-3 sm:pb-4 md:pb-6">
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0">
            <Cloud className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100 truncate">
              {t("weather.currentWeather")}
            </h2>
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 text-[10px] sm:text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
              <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 flex-shrink-0" />
              <span className="truncate">{currentWeather.location}</span>
            </div>
          </div>
        </div>
        <div className="text-left sm:text-right flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 text-[10px] sm:text-xs md:text-sm text-neutral-500 dark:text-neutral-400">
            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 flex-shrink-0" />
            <span className="truncate">
              {t("weather.updated")}: {currentWeather.lastUpdated}
            </span>
          </div>
        </div>
      </div>

      {/* Main Weather Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
        {/* Temperature and Icon */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-blue-50 dark:bg-blue-900/30 rounded-xl sm:rounded-2xl md:rounded-3xl flex items-center justify-center flex-shrink-0">
            <Image
              src={currentWeather.icon}
              alt="Weather icon"
              width={48}
              height={48}
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
            />
          </div>
          <div className="min-w-0">
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-neutral-100">
              {currentWeather.temperature}
            </h3>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-neutral-600 dark:text-neutral-400 font-medium truncate">
              {currentWeather.forecast}
            </p>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
          <WeatherDetailItem
            icon={
              <ThermometerSun className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
            }
            label={t("weather.temperature")}
            value={currentWeather.temperature}
          />
          <WeatherDetailItem
            icon={<Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
            label={t("weather.humidity")}
            value={currentWeather.humidity}
          />
          <WeatherDetailItem
            icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}
            label={t("weather.windSpeed")}
            value={currentWeather.windSpeed}
          />
          <WeatherDetailItem
            icon={<Umbrella className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
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
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 p-1.5 sm:p-2 md:p-2.5 lg:p-3 bg-neutral-50/80 dark:bg-neutral-700/80 rounded-lg sm:rounded-xl md:rounded-2xl">
      <div className="flex-shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[9px] sm:text-[10px] md:text-xs text-neutral-600 dark:text-neutral-400 font-medium truncate">
          {label}
        </p>
        <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
          {value}
        </p>
      </div>
    </div>
  );
};
