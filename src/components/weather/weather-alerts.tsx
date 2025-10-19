import React from "react";
import { AlertTriangle, Info } from "lucide-react";
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
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 p-6">
        <div className="flex items-center gap-3 pb-4">
          <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center">
            <Info className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-900">
            {t("weather.weatherAlerts")}
          </h2>
        </div>
        <div className="text-center py-8">
          <p className="text-neutral-500">{t("weather.noAlertsAtThisTime")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 p-6">
      <div className="flex items-center gap-3 pb-4">
        <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
        </div>
        <h2 className="text-xl font-semibold text-neutral-900">
          Weather Alerts
        </h2>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`p-4 rounded-2xl border ${
              alert.type === "warning"
                ? "bg-orange-50 border-orange-200"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <div className="flex items-start gap-3">
              {alert.type === "warning" ? (
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              )}
              <p
                className={`text-sm font-medium ${
                  alert.type === "warning" ? "text-orange-800" : "text-blue-800"
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
