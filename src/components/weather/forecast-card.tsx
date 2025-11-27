import React from "react";
import { CalendarToday } from "@mui/icons-material";
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
    <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-4 md:p-5 lg:p-6">
      {/* Header */}
      <div className="flex items-center gap-2 md:gap-3 pb-4 md:pb-6">
        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
          <CalendarToday className="text-purple-600" fontSize="small" />
        </div>
        <h2 className="text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100 truncate">
          {t("weather.fiveDayForecast")}
        </h2>
      </div>

      {/* Forecast Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        {forecast.map((day, index) => (
          <ForecastDayItem key={index} day={day} />
        ))}
      </div>
    </div>
  );
}

const ForecastDayItem: React.FC<ForecastDayItemProps> = ({ day }) => {
  return (
    <div className="p-3 md:p-4 bg-neutral-50/80 dark:bg-neutral-700/80 rounded-lg md:rounded-xl border border-neutral-100 dark:border-neutral-600">
      <div className="flex items-center gap-3 md:gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-white dark:bg-neutral-700/80 rounded-lg md:rounded-xl flex items-center justify-center">
          <Image
            src={`${day.icon}`}
            alt="Weather icon"
            width={32}
            height={32}
            className="w-8 h-8"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm truncate">
                {day.day}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 flex-shrink-0">
                {day.date}
              </p>
            </div>

            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate">
              {day.forecast}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {day.high}
              </span>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                {day.low}
              </span>
            </div>
            <span className="text-xs text-blue-600 font-medium flex-shrink-0">
              {day.rainChance}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
