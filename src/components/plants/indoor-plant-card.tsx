"use client";
import React from "react";
import { Droplets, Calendar, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { PLANT_TYPES, PlantType } from "@/lib/stores/plants-store";
import {
  deleteIndoorPlant,
  waterIndoorPlant,
  IndoorPlantData,
} from "@/actions/plant-actions";
import { useRouter } from "next/navigation";

interface IndoorPlantCardProps {
  plant: IndoorPlantData;
  onUpdate?: () => void;
}

export default function IndoorPlantCard({
  plant,
  onUpdate,
}: IndoorPlantCardProps) {
  const t = useTranslations();
  const router = useRouter();

  const plantInfo = PLANT_TYPES[plant.type as PlantType];

  // Calculate progress
  const plantingDate = new Date(plant.plantingDate);
  const daysSincePlanting = Math.floor(
    (new Date().getTime() - plantingDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const progress = Math.min((daysSincePlanting / plant.harvestDays) * 100, 100);
  const daysUntilHarvest = Math.max(plant.harvestDays - daysSincePlanting, 0);

  // Calculate days since last watered
  const daysSinceLastWatered = plant.lastWatered
    ? Math.floor(
        (new Date().getTime() - new Date(plant.lastWatered).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : daysSincePlanting;
  const needsWatering = daysSinceLastWatered >= plant.wateringFrequency;

  const formatDate = (date: Date | string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  };

  const handleWaterPlant = async () => {
    const result = await waterIndoorPlant(plant.id);
    if (result.success) {
      router.refresh();
      onUpdate?.();
    }
  };

  const handleRemovePlant = async () => {
    if (confirm(t("common.confirm") + " " + t("common.delete") + "?")) {
      const result = await deleteIndoorPlant(plant.id);
      if (result.success) {
        router.refresh();
        onUpdate?.();
      }
    }
  };

  return (
    <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-3 sm:p-4 md:p-6 hover:shadow-medium transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="text-2xl sm:text-3xl md:text-4xl flex-shrink-0">
            {plantInfo.icon}
          </span>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100 truncate">
              {plantInfo.name}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              {t("plants.plantingDay")} {formatDate(plant.plantingDate)}
            </p>
          </div>
        </div>
        <button
          onClick={handleRemovePlant}
          className="p-1.5 sm:p-2 text-neutral-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 sm:mb-5 md:mb-6">
        <div className="flex justify-between items-center mb-1.5 sm:mb-2">
          <span className="text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate">
            {daysUntilHarvest === 0
              ? t("plants.harvestReady")
              : t("plants.daysUntilHarvest")}
          </span>
          <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 flex-shrink-0 ml-2">
            {daysUntilHarvest === 0
              ? ""
              : `${daysUntilHarvest} ${
                  daysUntilHarvest === 1 ? t("plants.day") : t("plants.days")
                }`}
          </span>
        </div>
        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 sm:h-2.5 md:h-3">
          <div
            className={`h-2 sm:h-2.5 md:h-3 rounded-full transition-all duration-500 ${
              progress >= 100 ? "bg-green-500" : "bg-primary-500"
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          {Math.round(progress)}% {t("common.complete")}
        </div>
      </div>

      {/* Water Supply Info */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 md:p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg sm:rounded-xl">
          <Droplets
            className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${
              needsWatering
                ? "text-blue-600 dark:text-blue-400"
                : "text-blue-500 dark:text-blue-400"
            }`}
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
              {t("plants.waterSupply")}
            </div>
            <div
              className={`text-xs sm:text-sm truncate ${
                needsWatering
                  ? "text-blue-700 dark:text-blue-300"
                  : "text-blue-600 dark:text-blue-400"
              }`}
            >
              {needsWatering
                ? `${t("common.needs")} ${t("common.watering")}`
                : `${t("plants.waterEvery")} ${plant.wateringFrequency} ${
                    plant.wateringFrequency === 1
                      ? t("plants.day")
                      : t("plants.days")
                  }`}
            </div>
          </div>
          {needsWatering && (
            <button
              onClick={handleWaterPlant}
              className="px-2 sm:px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white text-xs sm:text-sm rounded-md sm:rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex-shrink-0"
            >
              {t("common.water")}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 md:p-3 bg-neutral-50/50 dark:bg-neutral-700/80 rounded-lg sm:rounded-xl">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600 dark:text-neutral-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
              {t("plants.wateringFrequency")}
            </div>
            <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 truncate">
              {daysSinceLastWatered === 0
                ? t("common.today")
                : `${daysSinceLastWatered} ${
                    daysSinceLastWatered === 1
                      ? t("plants.day")
                      : t("plants.days")
                  } ${t("common.ago")}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
