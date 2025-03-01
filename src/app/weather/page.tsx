'use client';
import { useState, useEffect } from 'react';
import { fetchWeatherData, CurrentWeather, ForecastDay } from '@/lib/weather';
import CurrentWeatherCard from '@/components/weather/current-weather-card';
import ForecastCard from '@/components/weather/forecast-card';
import WeatherAlerts from '@/components/weather/weather-alerts';
import CropImpactCard from '@/components/weather/crop-impact-card';
import { generateWeatherAlerts } from '@/utils/generate-weather-alerts';

export default function Weather() {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        setLoading(true);
        // Replace with your farm's coordinates
        const farmLat = 38.4504;
        const farmLon = 24.0036;
        
        const { currentWeather: weather, forecast: forecastData } = await fetchWeatherData(
          farmLat,
          farmLon,
        );
        
        setCurrentWeather(weather);
        setForecast(forecastData);
        setError(null);
      } catch (err) {
        setError("Failed to load weather data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();

    // Refresh weather data every 30 minutes
    const intervalId = setInterval(loadWeatherData, 30 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
        <div className="p-6 flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4">Loading weather data...</p>
          </div>
        </div> 
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="text-center text-red-500">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>    
    );
  }

  if (!currentWeather) {
    return null;
  }

  const weatherAlerts = generateWeatherAlerts(currentWeather, forecast);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Weather Dashboard</h1>
      
      {/* Current Weather Card */}
      <CurrentWeatherCard currentWeather={currentWeather} />
      
      {/* Weather Alerts */}
      <WeatherAlerts alerts={weatherAlerts} />
      
      {/* 7-Day Forecast */}
      <ForecastCard forecast={forecast} />
      
      {/* Weather Impact on Crops */}
      <CropImpactCard currentWeather={currentWeather} forecast={forecast} />
    </div> 
  );
}