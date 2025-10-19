"use client";
import React, { useEffect, useState } from "react";
import {
  Cloud,
  Droplets,
  Sun,
  ThermometerSun,
  ArrowRightIcon,
} from "lucide-react";
import { fetchWeatherData } from "@/lib/weather";
import Link from "next/link";
import { CurrentWeather } from "@/lib/types";
import { useLocale, useTranslations } from "next-intl";

export default function WeatherWidget() {
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const locale = useLocale();
  const t = useTranslations();

  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        setLoading(true);
        const farmLat = 38.4504;
        const farmLon = 24.0036;
        const farmName = "Example Farm, USA";

        const { currentWeather } = await fetchWeatherData(
          farmLat,
          farmLon,
          farmName
        );
        setWeather(currentWeather);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();
    const intervalId = setInterval(loadWeatherData, 60 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 p-6">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Cloud className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-900">
              {t("weather.weather")}
            </h2>
          </div>
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 p-6">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Cloud className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-900">
              {t("weather.weather")}
            </h2>
          </div>
        </div>
        <div className="py-8">
          <p className="text-center text-neutral-500">
            {t("weather.weatherDataNotAvailable")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 p-6">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Cloud className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-neutral-900">Weather</h2>
        </div>
        <Link
          href={`/${locale}/weather`}
          className="flex items-center gap-1 text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors"
        >
          {t("weather.viewAll")}
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-neutral-50/80 rounded-2xl">
          <div className="flex items-center gap-3">
            <ThermometerSun className="w-5 h-5 text-red-500" />
            <span className="text-sm text-neutral-600">
              {t("weather.temperature")}
            </span>
          </div>
          <span className="font-semibold text-neutral-900">
            {weather.temperature}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-neutral-50/80 rounded-2xl">
          <div className="flex items-center gap-3">
            <Droplets className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-neutral-600">
              {t("weather.humidity")}
            </span>
          </div>
          <span className="font-semibold text-neutral-900">
            {weather.humidity}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-neutral-50/80 rounded-2xl">
          <div className="flex items-center gap-3">
            <Sun className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-neutral-600">
              {t("weather.weatherForecast")}
            </span>
          </div>
          <span className="font-semibold text-neutral-900">
            {weather.forecast}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-neutral-50/80 rounded-2xl">
          <div className="flex items-center gap-3">
            <Cloud className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-neutral-600">
              {t("weather.precipitation")}
            </span>
          </div>
          <span className="font-semibold text-neutral-900">
            {weather.rainfall}
          </span>
        </div>
      </div>
    </div>
  );
}
