"use client";
import React from "react";
import { Sprout } from "lucide-react";
import { useTranslations } from "next-intl";
import PlantSuggestionInput from "@/components/plants/plant-suggestion-input";
import PlantCard from "@/components/plants/plant-card";
import {
  usePlantsStore,
  PlantType,
  PLANT_TYPES,
} from "@/lib/stores/plants-store";

export default function PlantsPage() {
  const t = useTranslations();
  const { plants, addPlant } = usePlantsStore();

  const handlePlantSelect = (plantType: PlantType) => {
    const plantInfo = PLANT_TYPES[plantType];
    addPlant({
      type: plantType,
      plantingDate: new Date(),
      harvestDays: plantInfo.harvestDays,
      wateringFrequency: plantInfo.wateringFrequency,
    });
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="pb-6 md:pb-8">
        <div className="flex items-center gap-3 mb-4">
          <Sprout className="w-8 h-8 text-primary-600" />
          <h1 className="text-2xl md:text-4xl font-bold text-neutral-900">
            {t("navigation.plants")}
          </h1>
        </div>
        <p className="text-base md:text-lg text-neutral-600">
          {t("plants.myPlants")}
        </p>
      </div>

      {/* Plant Suggestion Input */}
      {plants.length === 0 && (
        <div className="pb-8">
          <div className="text-center">
            <div className="mb-6">
              <Sprout className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-neutral-700 mb-2">
                {t("plants.noPlantsYet")}
              </h2>
              <p className="text-neutral-500 mb-6">
                {t("plants.suggestPlants")}
              </p>
            </div>
            <PlantSuggestionInput onPlantSelect={handlePlantSelect} />
          </div>
        </div>
      )}

      {/* Add Plant Button (when plants exist) */}
      {plants.length > 0 && (
        <div className="pb-6">
          <PlantSuggestionInput onPlantSelect={handlePlantSelect} />
        </div>
      )}

      {/* Plants Grid */}
      {plants.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      )}
    </div>
  );
}
