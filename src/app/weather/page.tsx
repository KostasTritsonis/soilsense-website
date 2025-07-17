"use client";
import { useState, useEffect } from "react";
import { fetchWeatherData } from "@/lib/weather";
import CurrentWeatherCard from "@/components/weather/current-weather-card";
import ForecastCard from "@/components/weather/forecast-card";
import WeatherAlerts from "@/components/weather/weather-alerts";
import CropImpactCard from "@/components/weather/crop-impact-card";
import { generateWeatherAlerts } from "@/utils/generate-weather-alerts";
import { CurrentWeather, ForecastDay } from "@/lib/types";
import { useLoadingStore } from "@/lib/stores/loading-store";
import { Search, MapPin } from "lucide-react";

export default function Weather() {
  const [location, setLocation] = useState<string>("38.4504,24.0036");
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(
    null
  );
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { setWeatherLoading } = useLoadingStore();

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      setWeatherLoading(true);
      const { currentWeather: weather, forecast: forecastData } =
        await fetchWeatherData(lat, lon);
      setCurrentWeather(weather);
      setForecast(forecastData);
      setError(null);
    } catch (err) {
      setError("Failed to load weather data. Please try again.");
      console.error(err);
    } finally {
      setWeatherLoading(false);
    }
  };

  const fetchCoordinatesFromCity = async (city: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          city
        )}`
      );
      const data = await response.json();
      if (data.length === 0) {
        setError("City not found. Try again.");
        return;
      }
      const { lat, lon } = data[0];
      setLocation(`${lat},${lon}`);
      fetchWeather(parseFloat(lat), parseFloat(lon));
    } catch (err) {
      setError("Error fetching location. Try again.");
      console.error(err);
    }
  };

  const handleSearch = async () => {
    if (location.includes(",")) {
      const [lat, lon] = location.split(",").map(Number);
      if (!lat || !lon) {
        setError("Invalid coordinates. Use format: lat,lon");
        return;
      }
      fetchWeather(lat, lon);
    } else {
      await fetchCoordinatesFromCity(location);
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
  }, [location]);

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="pb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-neutral-900 pb-2">
              Weather Dashboard
            </h1>
            <p className="text-lg text-neutral-600">
              Monitor weather conditions for your agricultural operations
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="pb-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 p-6">
          <h2 className="text-xl font-semibold text-neutral-900 pb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary-600" />
            Location Search
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter city or coordinates (e.g., New York or 37.7749,-122.4194)"
                className="w-full px-4 py-3 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-2xl font-semibold transition-colors shadow-soft hover:shadow-medium"
            >
              <Search className="w-5 h-5" />
              Search
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
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Weather Content */}
          <div className="lg:col-span-2 space-y-8">
            <CurrentWeatherCard currentWeather={currentWeather!} />
            <ForecastCard forecast={forecast} />
            <WeatherAlerts
              alerts={generateWeatherAlerts(currentWeather!, forecast)}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CropImpactCard
              currentWeather={currentWeather!}
              forecast={forecast}
            />
          </div>
        </div>
      )}
    </div>
  );
}
