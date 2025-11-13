import React from "react";
import { Calendar } from "lucide-react";
import { ForecastDay } from "@/lib/types";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface ForecastCardProps {
  forecast: ForecastDay[];
}

interface ForecastDayItemProps {
  day: ForecastDay;
}

export default function ForecastCard({ forecast }: ForecastCardProps) {
  const t = useTranslations();
  return (
    <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-6">
        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center">
          <Calendar className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          {t("weather.fiveDayForecast")}
        </h2>
      </div>

      {/* Forecast Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {forecast.map((day, index) => (
          <ForecastDayItem key={index} day={day} />
        ))}
      </div>
    </div>
  );
}

const ForecastDayItem: React.FC<ForecastDayItemProps> = ({ day }) => {
  return (
    <div className="p-4 bg-neutral-50/80 dark:bg-neutral-700/80 rounded-xl border border-neutral-100 dark:border-neutral-600 text-center">
      <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm pb-1">
        {day.day}
      </p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 pb-3">
        {day.date}
      </p>

      <div className="flex justify-center pb-3">
        <div className="w-12 h-12 bg-white dark:bg-neutral-700/80 rounded-xl flex items-center justify-center">
          <Image
            src={`${day.icon}`}
            alt="Weather icon"
            width={32}
            height={32}
            className="w-8 h-8"
          />
        </div>
      </div>

      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 pb-2">
        {day.forecast}
      </p>

      <div className="flex justify-center gap-2 pb-2">
        <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          {day.high}
        </span>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          {day.low}
        </span>
      </div>

      <p className="text-xs text-blue-600 font-medium">{day.rainChance}</p>
    </div>
  );
};
