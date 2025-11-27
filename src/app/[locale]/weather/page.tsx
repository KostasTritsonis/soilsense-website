"use client";
import { useState, useEffect, useCallback } from "react";
import { fetchWeatherData } from "@/lib/weather";
import CurrentWeatherCard from "@/components/weather/current-weather-card";
import ForecastCard from "@/components/weather/forecast-card";
import CropImpactAlertsCard from "@/components/weather/crop-impact-alerts-card";
import { generateWeatherAlerts } from "@/utils/generate-weather-alerts";
import { CurrentWeather, ForecastDay } from "@/lib/types";
import { useLoadingStore } from "@/lib/stores/loading-store";
import { Search, LocationOn } from "@mui/icons-material";
import { useTranslations } from "next-intl";

export default function Weather() {
  const [location, setLocation] = useState<string>("38.4504,24.0036");
  const [searchInput, setSearchInput] = useState<string>("");
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(
    null
  );
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { setWeatherLoading } = useLoadingStore();
  const t = useTranslations();

  const fetchWeather = useCallback(
    async (lat: number, lon: number, cityName?: string) => {
      try {
        setWeatherLoading(true);
        const { currentWeather: weather, forecast: forecastData } =
          await fetchWeatherData(lat, lon, cityName);
        setCurrentWeather(weather);
        setForecast(forecastData);
        setSearchInput(weather.location); // Update search input with location name
        setError(null);
      } catch (err) {
        setError(t("weather.weatherDataNotAvailable"));
        console.error(err);
      } finally {
        setWeatherLoading(false);
      }
    },
    [setWeatherLoading, t]
  );

  const fetchCoordinatesFromCity = async (city: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          city
        )}`
      );
      const data = await response.json();
      if (data.length === 0) {
        setError(t("errors.notFound"));
        return;
      }
      const { lat, lon } = data[0];
      setLocation(`${lat},${lon}`);
      fetchWeather(parseFloat(lat), parseFloat(lon), city);
    } catch (err) {
      setError(t("errors.network"));
      console.error(err);
    }
  };

  const handleSearch = async () => {
    const searchValue = searchInput.trim();
    if (!searchValue) return;

    if (searchValue.includes(",")) {
      const [lat, lon] = searchValue.split(",").map(Number);
      if (!lat || !lon) {
        setError(t("validation.invalidFormat"));
        return;
      }
      setLocation(`${lat},${lon}`);
      fetchWeather(lat, lon);
    } else {
      await fetchCoordinatesFromCity(searchValue);
    }
  };

  useEffect(() => {
    const [lat, lon] = location.split(",").map(Number);
    fetchWeather(lat, lon);
    const intervalId = setInterval(
      () => fetchWeather(lat, lon),
      30 * 60 * 1000
    );
    return () => clearInterval(intervalId);
  }, [location, fetchWeather]);

  return (
    <div className="w-full min-w-0 overflow-x-hidden">
      {/* Header Section */}
      <div className="pb-4 md:pb-6 lg:pb-8 min-w-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 md:gap-4 min-w-0">
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-neutral-900 dark:text-neutral-100 pb-1 md:pb-2 break-words">
              {t("weather.weather")}
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-neutral-600 dark:text-neutral-400 break-words">
              {t("weather.weatherForecast")}
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="pb-4 md:pb-6 lg:pb-8">
        <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-4 md:p-5 lg:p-6">
          <h2 className="text-base md:text-lg lg:text-xl font-semibold text-neutral-900 dark:text-neutral-100 pb-3 md:pb-4 flex items-center gap-2">
            <LocationOn
              className="text-primary-600 dark:text-primary-400 flex-shrink-0"
              sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
            />
            <span>{t("fields.location")}</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder={t("common.search")}
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-neutral-200 dark:border-neutral-600 rounded-lg md:rounded-xl bg-white/80 dark:bg-neutral-700/80 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base"
              />
            </div>
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-semibold transition-colors shadow-soft hover:shadow-medium text-sm md:text-base"
            >
              <Search sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }} />
              {t("common.search")}
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl md:rounded-3xl p-4 md:p-6 text-center">
          <p className="text-red-700 dark:text-red-300 font-medium text-sm md:text-base pb-3 md:pb-4">
            {error}
          </p>
          <button
            onClick={handleSearch}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white px-5 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl font-semibold transition-colors text-sm md:text-base"
          >
            {t("common.tryAgain")}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
          {/* Current Weather Card */}
          <div>
            <CurrentWeatherCard currentWeather={currentWeather!} />
          </div>

          {/* Forecast Card */}
          <div>
            <ForecastCard forecast={forecast} />
          </div>

          {/* Crop Impact & Alerts Card */}
          <div>
            <CropImpactAlertsCard
              currentWeather={currentWeather!}
              forecast={forecast}
              alerts={generateWeatherAlerts(currentWeather!, forecast)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
