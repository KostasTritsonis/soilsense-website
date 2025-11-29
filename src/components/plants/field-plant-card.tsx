"use client";
import React from "react";
import Image from "next/image";
import {
  WaterDrop,
  CalendarToday,
  LocalFlorist,
  LocationOn,
} from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { FieldPlantData } from "@/actions/plant-actions";
import { getFieldPlantTypeInfo } from "@/lib/field-plant-types";
import {
  waterFieldPlant,
  fertilizeFieldPlant,
  createOrUpdateFieldPlant,
} from "@/actions/plant-actions";
import { useRouter } from "next/navigation";

interface FieldPlantCardProps {
  fieldPlant: FieldPlantData;
  onUpdate?: () => void;
}

export default function FieldPlantCard({
  fieldPlant: plant,
  onUpdate,
}: FieldPlantCardProps) {
  const t = useTranslations();
  const router = useRouter();

  const plantInfo = getFieldPlantTypeInfo(plant.plantType);

  // Calculate progress if planting date exists
  const isInitialized =
    plant.plantingDate !== null && plant.plantingDate !== undefined;
  let progress = 0;
  let daysUntilHarvest = 0;
  let daysSincePlanting = 0;

  if (isInitialized && plant.plantingDate && plant.harvestDays) {
    const plantingDate = new Date(plant.plantingDate);
    daysSincePlanting = Math.floor(
      (new Date().getTime() - plantingDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    progress = Math.min((daysSincePlanting / plant.harvestDays) * 100, 100);
    daysUntilHarvest = Math.max(plant.harvestDays - daysSincePlanting, 0);
  }

  // Calculate days since last watered
  const daysSinceLastWatered = plant.lastWatered
    ? Math.floor(
        (new Date().getTime() - new Date(plant.lastWatered).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : isInitialized
    ? daysSincePlanting
    : 0;

  const needsWatering =
    isInitialized &&
    plant.wateringFrequency !== null &&
    plant.wateringFrequency !== undefined &&
    daysSinceLastWatered >= plant.wateringFrequency;

  // Calculate days since last fertilized
  const daysSinceLastFertilized = plant.lastFertilized
    ? Math.floor(
        (new Date().getTime() - new Date(plant.lastFertilized).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : isInitialized
    ? daysSincePlanting
    : 0;

  const needsFertilizing =
    isInitialized &&
    plant.fertilizerFrequency !== null &&
    plant.fertilizerFrequency !== undefined &&
    daysSinceLastFertilized >= plant.fertilizerFrequency;

  const formatDate = (date: Date | string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  };

  const handleWaterPlant = async () => {
    if (!plant.fieldPlantId) return;
    const result = await waterFieldPlant(plant.fieldPlantId);
    if (result.success) {
      router.refresh();
      onUpdate?.();
    }
  };

  const handleFertilizePlant = async () => {
    if (!plant.fieldPlantId) return;
    const result = await fertilizeFieldPlant(plant.fieldPlantId);
    if (result.success) {
      router.refresh();
      onUpdate?.();
    }
  };

  const handleInitializePlant = async () => {
    const result = await createOrUpdateFieldPlant({
      fieldId: plant.fieldId,
      categoryId: plant.categoryId,
      plantingDate: new Date(),
      harvestDays: plantInfo.harvestDays,
      wateringFrequency: plantInfo.wateringFrequency,
      fertilizerFrequency: plantInfo.fertilizerFrequency,
    });

    if (result.success) {
      router.refresh();
      onUpdate?.();
    }
  };

  return (
    <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-4 md:p-6 hover:shadow-medium transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {plantInfo.imageUrl ? (
            <Image
              src={plantInfo.imageUrl}
              alt={plantInfo.name}
              width={64}
              height={64}
              className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 object-contain"
            />
          ) : (
            <span className="text-3xl md:text-4xl flex-shrink-0">
              {plantInfo.icon}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100 truncate">
              {plantInfo.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <LocationOn
                className="text-neutral-500 dark:text-neutral-400 flex-shrink-0"
                fontSize="small"
              />
              <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                {plant.fieldLabel}
              </p>
            </div>
            {isInitialized && plant.plantingDate && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                {t("plants.plantingDay")} {formatDate(plant.plantingDate)}
              </p>
            )}
          </div>
        </div>
        {/* Field color indicator */}
        <div
          className="w-5 h-5 rounded-full flex-shrink-0 border border-neutral-300 dark:border-neutral-600"
          style={{ backgroundColor: plant.fieldColor }}
          title={plant.fieldLabel}
        />
      </div>

      {/* Progress Bar - Only show if initialized */}
      {isInitialized && plant.harvestDays && (
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
      )}

      {/* Not Initialized Message */}
      {!isInitialized && (
        <button
          onClick={handleInitializePlant}
          className="mb-5 md:mb-6 p-4 bg-primary-50/50 dark:bg-primary-900/20 rounded-xl border border-primary-200/50 dark:border-primary-800/50 hover:bg-primary-100/50 dark:hover:bg-primary-900/30 transition-colors w-full text-left"
        >
          <p className="text-sm text-neutral-900 dark:text-neutral-100">
            {t("plants.initializeFieldPlant")}
          </p>
        </button>
      )}

      {/* Care Info - Only show if initialized */}
      {isInitialized && (
        <div className="space-y-3">
          {/* Water Supply Info */}
          {plant.wateringFrequency !== null && (
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
                {plant.lastWatered && (
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {daysSinceLastWatered === 0
                      ? t("common.today")
                      : `${daysSinceLastWatered} ${
                          daysSinceLastWatered === 1
                            ? t("plants.day")
                            : t("plants.days")
                        } ${t("common.ago")}`}
                  </div>
                )}
              </div>
              {needsWatering && plant.fieldPlantId && (
                <button
                  onClick={handleWaterPlant}
                  className="px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex-shrink-0"
                >
                  {t("common.water")}
                </button>
              )}
            </div>
          )}

          {/* Fertilizer Info */}
          {plant.fertilizerFrequency !== null && (
            <div className="flex items-center gap-3 p-3 bg-green-50/50 dark:bg-green-900/20 rounded-xl">
              <LocalFlorist
                className={`flex-shrink-0 ${
                  needsFertilizing
                    ? "text-green-600 dark:text-green-400"
                    : "text-green-500 dark:text-green-400"
                }`}
                fontSize="small"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                  {t("plants.fertilizer")}
                </div>
                <div
                  className={`text-sm truncate ${
                    needsFertilizing
                      ? "text-green-700 dark:text-green-300"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {needsFertilizing
                    ? `${t("common.needs")} ${t("plants.fertilizing")}`
                    : `Every ${plant.fertilizerFrequency} ${
                        plant.fertilizerFrequency === 1
                          ? t("plants.day")
                          : t("plants.days")
                      }`}
                </div>
                {plant.lastFertilized && (
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {daysSinceLastFertilized === 0
                      ? t("common.today")
                      : `${daysSinceLastFertilized} ${
                          daysSinceLastFertilized === 1
                            ? t("plants.day")
                            : t("plants.days")
                        } ${t("common.ago")}`}
                  </div>
                )}
              </div>
              {needsFertilizing && plant.fieldPlantId && (
                <button
                  onClick={handleFertilizePlant}
                  className="px-3 py-1 bg-green-600 dark:bg-green-500 text-white text-sm rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex-shrink-0"
                >
                  {t("plants.fertilize")}
                </button>
              )}
            </div>
          )}

          {/* Planting Date Info */}
          {plant.plantingDate && (
            <div className="flex items-center gap-3 p-3 bg-neutral-50/50 dark:bg-neutral-700/80 rounded-xl">
              <CalendarToday
                className="text-neutral-600 dark:text-neutral-400 flex-shrink-0"
                fontSize="small"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                  {t("plants.plantingDay")}
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                  {formatDate(plant.plantingDate)}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
