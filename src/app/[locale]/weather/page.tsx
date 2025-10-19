"use client";
import { useState, useEffect, useCallback } from "react";
import { fetchWeatherData } from "@/lib/weather";
import CurrentWeatherCard from "@/components/weather/current-weather-card";
import ForecastCard from "@/components/weather/forecast-card";
import CropImpactAlertsCard from "@/components/weather/crop-impact-alerts-card";
import { generateWeatherAlerts } from "@/utils/generate-weather-alerts";
import { CurrentWeather, ForecastDay } from "@/lib/types";
import { useLoadingStore } from "@/lib/stores/loading-store";
import { Search, MapPin } from "lucide-react";
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
    <div className="w-full">
      {/* Header Section */}
      <div className="pb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="sm:text-4xl text-2xl font-bold text-neutral-900 pb-2">
              {t("weather.weather")}
            </h1>
            <p className="text-lg text-neutral-600">
              {t("weather.weatherForecast")}
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="pb-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 p-6">
          <h2 className="text-xl font-semibold text-neutral-900 pb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary-600" />
            {t("fields.location")}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder={t("common.search")}
                className="w-full px-4 py-3 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-2xl font-semibold transition-colors shadow-soft hover:shadow-medium"
            >
              <Search className="w-5 h-5" />
              {t("common.search")}
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center">
          <p className="text-red-700 font-medium pb-4">{error}</p>
          <button
            onClick={handleSearch}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-semibold transition-colors"
          >
            {t("common.tryAgain")}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
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
