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
      <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-6 text-center">
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          {t("weather.weatherDataNotAvailable")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
            <Cloud className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {t("weather.currentWeather")}
            </h2>
            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <MapPin className="w-4 h-4" />
              <span>{currentWeather.location}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <Clock className="w-4 h-4" />
            <span>
              {t("weather.updated")}: {currentWeather.lastUpdated}
            </span>
          </div>
        </div>
      </div>

      {/* Main Weather Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Temperature and Icon */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center">
            <Image
              src={currentWeather.icon}
              alt="Weather icon"
              width={48}
              height={48}
              className="w-12 h-12"
            />
          </div>
          <div>
            <h3 className="text-5xl font-bold text-neutral-900 dark:text-neutral-100">
              {currentWeather.temperature}
            </h3>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 font-medium">
              {currentWeather.forecast}
            </p>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-4">
          <WeatherDetailItem
            icon={<ThermometerSun className="w-5 h-5 text-red-500" />}
            label={t("weather.temperature")}
            value={currentWeather.temperature}
          />
          <WeatherDetailItem
            icon={<Droplets className="w-5 h-5 text-blue-500" />}
            label={t("weather.humidity")}
            value={currentWeather.humidity}
          />
          <WeatherDetailItem
            icon={<Wind className="w-5 h-5 text-gray-500" />}
            label={t("weather.windSpeed")}
            value={currentWeather.windSpeed}
          />
          <WeatherDetailItem
            icon={<Umbrella className="w-5 h-5 text-blue-500" />}
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
    <div className="flex items-center gap-3 p-3 bg-neutral-50/80 dark:bg-neutral-700/80 rounded-2xl">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
          {label}
        </p>
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          {value}
        </p>
      </div>
    </div>
  );
};
