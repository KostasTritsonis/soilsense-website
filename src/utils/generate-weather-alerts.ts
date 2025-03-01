
import { WeatherAlert } from '@/components/weather/weather-alerts';
import { CurrentWeather, ForecastDay } from '@/lib/types';

export function generateWeatherAlerts(currentWeather: CurrentWeather, forecast: ForecastDay[]): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];
  
  // Check for rain in the forecast
  const rainInNext3Days = forecast.slice(0, 3).some(day => 
    parseFloat(day.rainChance) > 60 || day.forecast.toLowerCase().includes('rain')
  );
  
  if (rainInNext3Days) {
    alerts.push({ 
      type: 'warning', 
      message: 'Heavy rain expected in the next 3 days - Consider delaying fertilizer application' 
    });
  }
  
  // Check for optimal irrigation conditions
  if (parseFloat(currentWeather.rainfall.replace('mm', '')) < 1 && 
      parseFloat(forecast[0].rainChance) < 30) {
    alerts.push({ 
      type: 'info', 
      message: 'Optimal conditions for irrigation in the next 24 hours' 
    });
  }
  
  // Check for extreme temperatures
  const highTempInNext3Days = forecast.slice(0, 3).some(day => 
    parseInt(day.high.replace('°C', '')) > 30
  );
  
  if (highTempInNext3Days) {
    alerts.push({ 
      type: 'warning', 
      message: 'High temperatures expected - Consider additional irrigation for vulnerable crops' 
    });
  }
  
  return alerts;
}