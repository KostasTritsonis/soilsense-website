"use client";
import React, { useState } from "react";
import { ExpandMore, Add } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { PlantType, PLANT_TYPES } from "@/lib/stores/plants-store";

interface PlantSuggestionInputProps {
  onPlantSelect: (plantType: PlantType) => void;
}

export default function PlantSuggestionInput({
  onPlantSelect,
}: PlantSuggestionInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const t = useTranslations();

  const filteredPlants = Object.entries(PLANT_TYPES).filter(([, plant]) =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlantSelect = (plantType: PlantType) => {
    onPlantSelect(plantType);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder={t("plants.suggestPlants")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full px-4 py-2 md:py-3 pr-12 bg-white/90 dark:bg-neutral-700/80 backdrop-blur-sm border border-white/60 dark:border-neutral-600 rounded-xl md:rounded-2xl shadow-soft text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-all text-sm md:text-base"
        />
        <ExpandMore
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fontSize="small"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm border border-white/60 dark:border-neutral-700/60 rounded-xl md:rounded-2xl shadow-large z-50 max-h-60 overflow-y-auto">
          {filteredPlants.length > 0 ? (
            <div className="p-2">
              {filteredPlants.map(([key, plant]) => (
                <button
                  key={key}
                  onClick={() => handlePlantSelect(key as PlantType)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 dark:hover:bg-neutral-700/80 transition-colors text-left"
                >
                  <span className="text-xl md:text-2xl flex-shrink-0">
                    {plant.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-base text-neutral-900 dark:text-neutral-100 truncate">
                      {plant.name}
                    </div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                      {t("plants.harvestDays")}: {plant.harvestDays}{" "}
                      {t("plants.days")} • {t("plants.waterEvery")}{" "}
                      {plant.wateringFrequency}{" "}
                      {plant.wateringFrequency === 1
                        ? t("plants.day")
                        : t("plants.days")}
                    </div>
                  </div>
                  <Add
                    className="text-primary-600 dark:text-primary-400 flex-shrink-0"
                    fontSize="small"
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
              {t("common.noResults")}
            </div>
          )}
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
