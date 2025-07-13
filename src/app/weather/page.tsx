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

export default function Weather() {
  const [location, setLocation] = useState<string>("38.4504,24.0036"); // Default coordinates
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
    <div className="p-6 space-y-6 max-sm:pb-[80px] mx-auto">
      <h1 className="text-center text-2xl font-bold">Weather Dashboard</h1>

      {/* 🔍 Search Bar */}
      <div className="flex justify-center gap-2">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter city or lat,lon (e.g., New York or 37.7749,-122.4194)"
          className="border p-2 rounded w-72"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {error ? (
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button
            onClick={handleSearch}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      ) : (
        <section className="w-[70%] mx-auto flex flex-col gap-y-6">
          <CurrentWeatherCard currentWeather={currentWeather!} />
          <ForecastCard forecast={forecast} />
          <WeatherAlerts
            alerts={generateWeatherAlerts(currentWeather!, forecast)}
          />
          <CropImpactCard
            currentWeather={currentWeather!}
            forecast={forecast}
          />
        </section>
      )}
    </div>
  );
}
