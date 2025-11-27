"use client";
import React from "react";
import { WaterDrop, CalendarToday, Delete } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { Plant, PLANT_TYPES } from "@/lib/stores/plants-store";
import { usePlantsStore } from "@/lib/stores/plants-store";

interface PlantCardProps {
  plant: Plant;
}

export default function PlantCard({ plant }: PlantCardProps) {
  const t = useTranslations();
  const {
    removePlant,
    waterPlant,
    getPlantProgress,
    getDaysUntilHarvest,
    getDaysSinceLastWatered,
  } = usePlantsStore();

  const plantInfo = PLANT_TYPES[plant.type];
  const progress = getPlantProgress(plant);
  const daysUntilHarvest = getDaysUntilHarvest(plant);
  const daysSinceLastWatered = getDaysSinceLastWatered(plant);
  const needsWatering = daysSinceLastWatered >= plant.wateringFrequency;

  const formatDate = (date: Date | string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  };

  const handleWaterPlant = () => {
    waterPlant(plant.id);
  };

  const handleRemovePlant = () => {
    removePlant(plant.id);
  };

  return (
    <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-4 md:p-6 hover:shadow-medium transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-3xl md:text-4xl flex-shrink-0">
            {plantInfo.icon}
          </span>
          <div className="min-w-0">
            <h3 className="text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100 truncate">
              {plantInfo.name}
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {t("plants.plantingDay")} {formatDate(plant.plantingDate)}
            </p>
          </div>
        </div>
        <button
          onClick={handleRemovePlant}
          className="p-2 text-neutral-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0"
        >
          <Delete fontSize="small" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-5 md:mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate">
            {daysUntilHarvest === 0
              ? t("plants.harvestReady")
              : t("plants.daysUntilHarvest")}
          </span>
          <span className="text-sm text-neutral-500 dark:text-neutral-400 flex-shrink-0 ml-2">
            {daysUntilHarvest === 0
              ? ""
              : `${daysUntilHarvest} ${
                  daysUntilHarvest === 1 ? t("plants.day") : t("plants.days")
                }`}
          </span>
        </div>
        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              progress >= 100 ? "bg-green-500" : "bg-primary-500"
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          {Math.round(progress)}% {t("common.complete")}
        </div>
      </div>

      {/* Water Supply Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl">
          <WaterDrop
            className={`flex-shrink-0 ${
              needsWatering
                ? "text-blue-600 dark:text-blue-400"
                : "text-blue-500 dark:text-blue-400"
            }`}
            fontSize="small"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
              {t("plants.waterSupply")}
            </div>
            <div
              className={`text-sm truncate ${
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
              className="px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex-shrink-0"
            >
              {t("common.water")}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 p-3 bg-neutral-50/50 dark:bg-neutral-700/80 rounded-xl">
          <CalendarToday
            className="text-neutral-600 dark:text-neutral-400 flex-shrink-0"
            fontSize="small"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
              {t("plants.wateringFrequency")}
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
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
