import React from 'react'
import { Calendar } from 'lucide-react';
import { ForecastDay } from '@/lib/types';
import Image from 'next/image';


interface ForecastCardProps {
  forecast: ForecastDay[];
}

interface ForecastDayItemProps {
  day: ForecastDay;
}


export default function ForecastCard({ forecast }: ForecastCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4">
        <div className="flex items-center">
          <Calendar className="mr-2 h-6 w-6" />
          <h2 className="text-xl font-semibold">5-Day Forecast</h2>
        </div>
      </div>
      <div className="px-6 pb-6">
        <div className="flex  justify-center gap-10 overflow-x-auto">
          {forecast.map((day, index) => (
            <ForecastDayItem key={index} day={day} />
          ))}
        </div>
      </div>
    </div>
  );
}


const ForecastDayItem: React.FC<ForecastDayItemProps> = ({ day }) => {
  return (
    <div className="p-3 text-center border rounded-md">
      <p className="font-medium">{day.day}</p>
      <p className="text-sm text-gray-500">{day.date}</p>
      <div className="my-2 flex justify-center">
        <Image 
          src={`${day.icon}`} 
          alt="Weather icon" 
          width={50} 
          height={50}
        />
      </div>
      <p className="text-sm">{day.forecast}</p>
      <div className="mt-2">
        <p className="font-medium">{day.high}</p>
        <p className="text-sm text-gray-500">{day.low}</p>
      </div>
      <p className="mt-2 text-sm text-blue-500">{day.rainChance}</p>
    </div>
  );
};
