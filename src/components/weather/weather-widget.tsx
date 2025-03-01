'use client';
import React, { useEffect, useState } from 'react';
import { Cloud, Droplets, Sun, ThermometerSun,ArrowRightIcon } from 'lucide-react';
import { fetchWeatherData } from '@/lib/weather';
import Link from 'next/link';
import { CurrentWeather } from '@/lib/types';

export default function WeatherWidget(){
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        setLoading(true);
        // Replace with your farm's coordinates
        const farmLat = 38.4504;
        const farmLon = 24.0036;
        const farmName = "Example Farm, USA";
        
        const { currentWeather } = await fetchWeatherData(farmLat, farmLon, farmName);
        setWeather(currentWeather);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();
    
    // Refresh every hour
    const intervalId = setInterval(loadWeatherData, 60 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="bg-zinc-100 rounded-lg mt-12 shadow-xl overflow-hidden">
        <div className="px-6 py-4">
          <div className="flex items-center">
            <Cloud className="mr-2 h-6 w-6" />
            <h2 className="text-xl font-semibold">Weather Conditions</h2>
          </div>
        </div>
        <div className="px-6 pb-6 flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-zinc-100 rounded-lg mt-12 shadow-xl overflow-hidden">
        <div className="px-6 py-4">
          <div className="flex items-center">
            <Cloud className="mr-2 h-6 w-6" />
            <h2 className="text-xl font-semibold">Weather Conditions</h2>
          </div>
        </div>
        <div className="px-6 pb-6">
          <p className="text-center text-gray-500">Unable to load weather data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-100 rounded-lg mt-12 shadow-xl overflow-hidden">
      <div className="pl-4 py-4">
        <div className="flex items-center border-b border-zinc-400/20">
          <Cloud className="mr-2 h-6 w-6" />
          <h2 className="text-xl font-semibold">Weather Conditions</h2>
          <Link href="/weather" className='ml-auto'><p className=" flex border rounded-md border-zinc-200/20 bg-zinc-200/40 p-1  m-4 text-[15px] text-green-700 font-semibold">See all <ArrowRightIcon /></p></Link>
        </div>
      </div>
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <ThermometerSun className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Temperature</p>
              <p className="font-medium">{weather.temperature}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Droplets className="h-5 w-5 text-blue-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Humidity</p>
              <p className="font-medium">{weather.humidity}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Sun className="h-5 w-5 text-yellow-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Forecast</p>
              <p className="font-medium">{weather.forecast}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Cloud className="h-5 w-5 text-gray-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Rainfall</p>
              <p className="font-medium">{weather.rainfall}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};