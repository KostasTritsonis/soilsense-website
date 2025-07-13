import React from "react";
import { Cloud, Droplets, ThermometerSun, Wind, Umbrella } from "lucide-react";
import { CurrentWeather } from "@/lib/types";
import Image from "next/image";

interface CurrentWeatherCardProps {
  currentWeather: CurrentWeather;
}

// Helper component for weather details
interface WeatherDetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export default function CurrentWeatherCard({
  currentWeather,
}: CurrentWeatherCardProps) {
  if (!currentWeather) {
    return (
      <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl shadow-green-100/40 p-6 text-center text-gray-500 transition-transform hover:scale-105 hover:shadow-green-200/60 overflow-hidden">
        Weather data not available.
      </div>
    );
  }
  return (
    <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl shadow-green-100/40 p-6 transition-transform hover:scale-105 hover:shadow-green-200/60 overflow-hidden">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Cloud className="mr-2 h-6 w-6" />
            <h2 className="text-xl font-semibold">
              Current Weather at {currentWeather.location}
            </h2>
          </div>
          <p className="text-sm text-gray-500">
            Last updated: {currentWeather.lastUpdated}
          </p>
        </div>
      </div>
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main weather display */}
          <div className="flex items-center space-x-4">
            <Image
              src={currentWeather.icon}
              alt="Weather icon"
              width={50}
              height={50}
            />
            <div>
              <h2 className="text-4xl font-bold">
                {currentWeather.temperature}
              </h2>
              <p className="text-xl">{currentWeather.forecast}</p>
            </div>
          </div>

          {/* Weather details grid */}
          <div className="grid grid-cols-2 gap-4">
            <WeatherDetailItem
              icon={<ThermometerSun className="h-5 w-5 text-red-500 mr-2" />}
              label="Temperature"
              value={currentWeather.temperature}
            />
            <WeatherDetailItem
              icon={<Droplets className="h-5 w-5 text-blue-500 mr-2" />}
              label="Humidity"
              value={currentWeather.humidity}
            />
            <WeatherDetailItem
              icon={<Wind className="h-5 w-5 text-gray-500 mr-2" />}
              label="Wind Speed"
              value={currentWeather.windSpeed}
            />
            <WeatherDetailItem
              icon={<Umbrella className="h-5 w-5 text-blue-500 mr-2" />}
              label="Rainfall"
              value={currentWeather.rainfall}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const WeatherDetailItem: React.FC<WeatherDetailItemProps> = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-center">
      {icon}
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
};
