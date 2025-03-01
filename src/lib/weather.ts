import { CurrentWeather, ForecastApiResponse, ForecastDay, WeatherApiResponse } from "./types";




export async function fetchWeatherData(lat: number, lon: number, locationName?: string) {
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  if (!API_KEY) {
    console.error("OpenWeather API key is missing");
    throw new Error("API key is required");
  }

  try {
    // Fetch current weather data
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    if (!currentResponse.ok) {
      throw new Error(`Current Weather API error: ${currentResponse.status}`);
    }

    const currentData: WeatherApiResponse = await currentResponse.json();

    // Fetch 5-day forecast data
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    if (!forecastResponse.ok) {
      throw new Error(`Forecast API error: ${forecastResponse.status}`);
    }

    const forecastData: ForecastApiResponse = await forecastResponse.json();

    // Use location name if provided, otherwise get city name from response
    const location = locationName || currentData.name || "Unknown location";

    const currentWeather: CurrentWeather = {
      temperature: `${Math.round(currentData.main.temp)}°C`,
      humidity: `${currentData.main.humidity}%`,
      windSpeed: `${Math.round(currentData.wind.speed * 3.6)} km/h`, // Convert m/s to km/h
      forecast: currentData.weather[0].description,
      rainfall: currentData.rain ? `${currentData.rain["1h"].toFixed(1)}mm` : "0mm",
      location,
      lastUpdated: new Date(currentData.dt * 1000).toLocaleString(),
      icon: `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`,
    };

    // Process 5-day forecast (group by date)
    const dailyForecast: { [key: string]: ForecastDay } = {};

    forecastData.list.forEach((entry) => {
      const date = new Date(entry.dt * 1000);
      const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD format
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

      if (!dailyForecast[dateKey]) {
        dailyForecast[dateKey] = {
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          day: dayName,
          high: `${Math.round(entry.main.temp_max)}°C`,
          low: `${Math.round(entry.main.temp_min)}°C`,
          forecast: entry.weather[0].description,
          rainChance: `${Math.round(entry.pop * 100)}%`,
          icon: `https://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`,
        };
      } else {
        // Update min/max temp
        const prev = dailyForecast[dateKey];
        dailyForecast[dateKey].high = `${Math.max(parseInt(prev.high), Math.round(entry.main.temp_max))}°C`;
        dailyForecast[dateKey].low = `${Math.min(parseInt(prev.low), Math.round(entry.main.temp_min))}°C`;
      }
    });

    const forecast: ForecastDay[] = Object.values(dailyForecast).slice(0, 5); // Get 5-day forecast

    return { currentWeather, forecast };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}
