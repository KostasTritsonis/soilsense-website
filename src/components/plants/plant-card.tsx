"use client";
import React from "react";
import { Droplets, Calendar, Trash2 } from "lucide-react";
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
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 p-6 hover:shadow-medium transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{plantInfo.icon}</span>
          <div>
            <h3 className="text-xl font-semibold text-neutral-900">
              {plantInfo.name}
            </h3>
            <p className="text-sm text-neutral-500">
              {t("plants.plantingDay")} {formatDate(plant.plantingDate)}
            </p>
          </div>
        </div>
        <button
          onClick={handleRemovePlant}
          className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-neutral-700">
            {daysUntilHarvest === 0
              ? t("plants.harvestReady")
              : t("plants.daysUntilHarvest")}
          </span>
          <span className="text-sm text-neutral-500">
            {daysUntilHarvest === 0
              ? ""
              : `${daysUntilHarvest} ${
                  daysUntilHarvest === 1 ? t("plants.day") : t("plants.days")
                }`}
          </span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              progress >= 100 ? "bg-green-500" : "bg-primary-500"
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="text-xs text-neutral-500 mt-1">
          {Math.round(progress)}% {t("common.complete")}
        </div>
      </div>

      {/* Water Supply Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl">
          <Droplets
            className={`w-5 h-5 ${
              needsWatering ? "text-blue-600" : "text-blue-500"
            }`}
          />
          <div className="flex-1">
            <div className="text-sm font-medium text-neutral-900">
              {t("plants.waterSupply")}
            </div>
            <div
              className={`text-sm ${
                needsWatering ? "text-blue-700" : "text-blue-600"
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
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t("common.water")}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 p-3 bg-neutral-50/50 rounded-xl">
          <Calendar className="w-5 h-5 text-neutral-600" />
          <div className="flex-1">
            <div className="text-sm font-medium text-neutral-900">
              {t("plants.wateringFrequency")}
            </div>
            <div className="text-sm text-neutral-600">
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
