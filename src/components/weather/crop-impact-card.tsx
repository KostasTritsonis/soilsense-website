import { CurrentWeather, ForecastDay } from '@/lib/types';
import React from 'react'



interface CropImpactCardProps {
  currentWeather: CurrentWeather;
  forecast: ForecastDay[];
}

export default function CropImpactCard({ currentWeather, forecast }: CropImpactCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-xl font-semibold">Weather Impact on Crops</h2>
      </div>
      <div className="px-6 pb-6">
        <div className="space-y-4">
          <CropImpactItem
            cropName="Corn (Field 3)"
            currentWeather={currentWeather}
            forecast={forecast}
            optimalTempRange={[18, 25]}
            highHumidityThreshold={70}
          />
          
          <CropImpactItem
            cropName="Wheat (Field 1)"
            currentWeather={currentWeather}
            forecast={forecast}
            optimalTempRange={[15, 24]}
            highHumidityThreshold={75}
          />
        </div>
      </div>
    </div>
  )
}

interface CropImpactItemProps {
  cropName: string;
  currentWeather: CurrentWeather;
  forecast: ForecastDay[];
  optimalTempRange: [number, number];
  highHumidityThreshold: number;
}

const CropImpactItem: React.FC<CropImpactItemProps> = ({
  cropName,
  currentWeather,
  forecast,
  optimalTempRange,
  highHumidityThreshold
}) => {
  const currentTemp = parseInt(currentWeather.temperature);
  const currentHumidity = parseInt(currentWeather.humidity);
  const isOptimalTemp = currentTemp >= optimalTempRange[0] && currentTemp <= optimalTempRange[1];
  const isHighHumidity = currentHumidity > highHumidityThreshold;
  const heavyRainExpected = forecast.slice(0, 3).some(day => parseFloat(day.rainChance) > 60);

  return (
    <div className="p-4 border rounded-md">
      <h3 className="font-medium mb-2">{cropName}</h3>
      {isOptimalTemp ? (
        <p className="text-sm text-gray-700 mb-2">Current conditions are <span className="text-green-600 font-medium">favorable</span> for growth.</p>
      ) : (
        <p className="text-sm text-gray-700 mb-2">Current conditions are <span className="text-yellow-600 font-medium">moderately favorable</span> for growth.</p>
      )}
      <ul className="text-sm list-disc pl-5 space-y-1">
        <li>Optimal temperature range: {optimalTempRange[0]}-{optimalTempRange[1]}°C (Current: {currentWeather.temperature})</li>
        {isHighHumidity ? (
          <li className="text-yellow-600">High humidity levels - monitor for fungal diseases</li>
        ) : (
          <li>Adequate moisture levels</li>
        )}
        {heavyRainExpected && (
          <li className="text-yellow-600">Warning: Heavy rain expected in next few days</li>
        )}
        {isHighHumidity && (
          <li>Recommendation: Monitor for fungal diseases</li>
        )}
      </ul>
    </div>
  );
};
