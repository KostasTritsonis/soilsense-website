'use client';
import { useState, useEffect } from 'react';
import { fetchWeatherData } from '@/lib/weather';
import CurrentWeatherCard from '@/components/weather/current-weather-card';
import ForecastCard from '@/components/weather/forecast-card';
import WeatherAlerts from '@/components/weather/weather-alerts';
import CropImpactCard from '@/components/weather/crop-impact-card';
import { generateWeatherAlerts } from '@/utils/generate-weather-alerts';
import { CurrentWeather, ForecastDay } from '@/lib/types';

export default function Weather() {
  const [location, setLocation] = useState<string>('38.4504,24.0036'); // Default coordinates
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      const { currentWeather: weather, forecast: forecastData } = await fetchWeatherData(lat, lon);
      setCurrentWeather(weather);
      setForecast(forecastData);
      setError(null);
    } catch (err) {
      setError('Failed to load weather data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    const [lat, lon] = location.split(',').map(Number);
    if (!lat || !lon) {
      setError('Invalid coordinates. Please enter latitude and longitude.');
      return;
    }
    await fetchWeather(lat, lon);
  };

  useEffect(() => {
    const [lat, lon] = location.split(',').map(Number);
    fetchWeather(lat, lon);
    const intervalId = setInterval(() => fetchWeather(lat, lon), 30 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [location]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Weather Dashboard</h1>

      {/* 🔍 Search Bar */}
      <div className="flex gap-2">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter Lat,Lon (e.g., 37.7749,-122.4194)"
          className="border p-2 rounded w-full"
        />
        <button onClick={handleSearch} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Search
        </button>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading weather data...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button onClick={handleSearch} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Retry
          </button>
        </div>
      ) : (
        <>
          <CurrentWeatherCard currentWeather={currentWeather!} />
          <WeatherAlerts alerts={generateWeatherAlerts(currentWeather!, forecast)} />
          <ForecastCard forecast={forecast} />
          <CropImpactCard currentWeather={currentWeather!} forecast={forecast} />
        </>
      )}
    </div>
  );
}
