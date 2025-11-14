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
    <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl md:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-3 sm:p-4 md:p-5 lg:p-6">
      {/* Header */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 pb-3 sm:pb-4 md:pb-6">
        <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0">
          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-purple-600" />
        </div>
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100 truncate">
          {t("weather.fiveDayForecast")}
        </h2>
      </div>

      {/* Forecast Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
        {forecast.map((day, index) => (
          <ForecastDayItem key={index} day={day} />
        ))}
      </div>
    </div>
  );
}

const ForecastDayItem: React.FC<ForecastDayItemProps> = ({ day }) => {
  return (
    <div className="p-2.5 sm:p-3 md:p-3.5 lg:p-4 bg-neutral-50/80 dark:bg-neutral-700/80 rounded-md sm:rounded-lg md:rounded-xl border border-neutral-100 dark:border-neutral-600">
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white dark:bg-neutral-700/80 rounded-md sm:rounded-lg md:rounded-xl flex items-center justify-center">
          <Image
            src={`${day.icon}`}
            alt="Weather icon"
            width={32}
            height={32}
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between gap-1.5 sm:gap-2">
          <div className="flex flex-col gap-0.5 sm:gap-1">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-[11px] sm:text-xs md:text-sm truncate">
                {day.day}
              </p>
              <p className="text-[9px] sm:text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400 flex-shrink-0">
                {day.date}
              </p>
            </div>

            <p className="text-[10px] sm:text-xs md:text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate">
              {day.forecast}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {day.high}
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm text-neutral-500 dark:text-neutral-400">
                {day.low}
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] md:text-xs text-blue-600 font-medium flex-shrink-0">
              {day.rainChance}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
