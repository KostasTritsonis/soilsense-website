import React from "react";
import { Warning, Info } from "@mui/icons-material";
import { useTranslations } from "next-intl";

export interface WeatherAlert {
  type: "warning" | "info";
  message: string;
}

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
}

export default function WeatherAlerts({ alerts }: WeatherAlertsProps) {
  const t = useTranslations();
  if (alerts.length === 0) {
    return (
      <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-6">
        <div className="flex items-center gap-3 pb-4">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
            <Info
              className="text-green-600 dark:text-green-400"
              fontSize="small"
            />
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            {t("weather.weatherAlerts")}
          </h2>
        </div>
        <div className="text-center py-8">
          <p className="text-neutral-500 dark:text-neutral-400">
            {t("weather.noAlertsAtThisTime")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-6">
      <div className="flex items-center gap-3 pb-4">
        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center">
          <Warning
            className="text-orange-600 dark:text-orange-400"
            fontSize="small"
          />
        </div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          Weather Alerts
        </h2>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`p-4 rounded-2xl border ${
              alert.type === "warning"
                ? "bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-600"
                : "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-600"
            }`}
          >
            <div className="flex items-start gap-3">
              {alert.type === "warning" ? (
                <Warning
                  className="text-orange-600 dark:text-orange-300 flex-shrink-0 mt-0.5"
                  fontSize="small"
                />
              ) : (
                <Info
                  className="text-blue-600 dark:text-blue-300 flex-shrink-0 mt-0.5"
                  fontSize="small"
                />
              )}
              <p
                className={`text-sm font-medium ${
                  alert.type === "warning"
                    ? "text-orange-800 dark:text-orange-300"
                    : "text-blue-800 dark:text-blue-300"
                }`}
              >
                {alert.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
