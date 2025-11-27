"use client";
import React, { useState, useEffect, useCallback } from "react";
import { LocalFlorist } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import PlantSuggestionInput from "@/components/plants/plant-suggestion-input";
import IndoorPlantCard from "@/components/plants/indoor-plant-card";
import FieldPlantCard from "@/components/plants/field-plant-card";
import { PlantType, PLANT_TYPES } from "@/lib/stores/plants-store";
import {
  getIndoorPlantsByUser,
  getFieldPlantsByUser,
  createIndoorPlant,
  IndoorPlantData,
  FieldPlantData,
} from "@/actions/plant-actions";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

type PlantSection = "indoor" | "field";

export default function PlantsPage() {
  const t = useTranslations();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [activeSection, setActiveSection] = useState<PlantSection>("indoor");
  const [indoorPlants, setIndoorPlants] = useState<IndoorPlantData[]>([]);
  const [fieldPlants, setFieldPlants] = useState<FieldPlantData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlants = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      console.log("Loading plants...");
      const [indoor, field] = await Promise.all([
        getIndoorPlantsByUser(),
        getFieldPlantsByUser(),
      ]);
      console.log("Indoor plants:", indoor);
      console.log("Field plants:", field);
      setIndoorPlants(indoor || []);
      setFieldPlants(field || []);
    } catch (error) {
      console.error("Error loading plants:", error);
      setError(
        error instanceof Error
          ? error.message
          : t("common.errorLoadingData") || "Failed to load plants"
      );
    } finally {
      setLoading(false);
    }
  }, [user, t]);

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        loadPlants();
      } else {
        setLoading(false);
        setError("Please sign in to view your plants");
      }
    }
  }, [isLoaded, user, loadPlants]);

  const handlePlantSelect = async (plantType: PlantType) => {
    const plantInfo = PLANT_TYPES[plantType];
    const result = await createIndoorPlant({
      type: plantType,
      plantingDate: new Date(),
      harvestDays: plantInfo.harvestDays,
      wateringFrequency: plantInfo.wateringFrequency,
    });

    if (result.success) {
      router.refresh();
      await loadPlants();
    }
  };

  return (
    <div className="w-full min-w-0 flex flex-col">
      {/* Header Section */}
      <div className="pb-4 md:pb-6 lg:pb-8 flex-shrink-0 min-w-0">
        <div className="flex items-center gap-3 mb-4 min-w-0">
          <LocalFlorist
            className="text-primary-600 flex-shrink-0"
            sx={{ fontSize: "2rem" }}
          />
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-300 break-words min-w-0">
            {t("navigation.plants")}
          </h1>
        </div>
        <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-200 break-words">
          {t("plants.myPlants")}
        </p>
      </div>

      {/* Toggle Section */}
      <div className="mb-6 md:mb-8 flex-shrink-0 min-w-0">
        <div className="inline-flex rounded-lg bg-neutral-100 dark:bg-neutral-800 p-1 border border-neutral-200 dark:border-neutral-700">
          <button
            onClick={() => setActiveSection("indoor")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeSection === "indoor"
                ? "bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-sm"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            {t("plants.indoorPlants")}
          </button>
          <button
            onClick={() => setActiveSection("field")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeSection === "field"
                ? "bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-sm"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            {t("plants.fieldPlants")}
          </button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="min-w-0 overflow-x-hidden">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-neutral-500 dark:text-neutral-400">
              {t("common.loading")}
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 max-w-md mx-auto">
              <p className="text-red-700 dark:text-red-300 font-medium mb-4">
                {error}
              </p>
              <button
                onClick={loadPlants}
                className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold transition-colors"
              >
                {t("common.tryAgain") || "Try Again"}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Indoor Plants Section */}
            {activeSection === "indoor" && (
              <>
                {/* Plant Suggestion Input */}
                {indoorPlants.length === 0 && (
                  <div className="pb-8">
                    <div className="text-center">
                      <div className="mb-6">
                        <LocalFlorist
                          className="text-neutral-300 mx-auto mb-4"
                          sx={{ fontSize: "4rem" }}
                        />
                        <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                          {t("plants.noPlantsYet")}
                        </h2>
                        <p className="text-neutral-500 dark:text-neutral-400 mb-6">
                          {t("plants.suggestPlants")}
                        </p>
                      </div>
                      <PlantSuggestionInput onPlantSelect={handlePlantSelect} />
                    </div>
                  </div>
                )}

                {/* Add Plant Button (when plants exist) */}
                {indoorPlants.length > 0 && (
                  <div className="pb-6">
                    <PlantSuggestionInput onPlantSelect={handlePlantSelect} />
                  </div>
                )}

                {/* Indoor Plants Grid */}
                {indoorPlants.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {indoorPlants.map((plant) => (
                      <IndoorPlantCard
                        key={plant.id}
                        plant={plant}
                        onUpdate={loadPlants}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Field Plants Section */}
            {activeSection === "field" && (
              <>
                {fieldPlants.length === 0 ? (
                  <div className="text-center py-12">
                    <LocalFlorist
                      className="text-neutral-300 mx-auto mb-4"
                      sx={{ fontSize: "4rem" }}
                    />
                    <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                      {t("plants.noFieldPlants")}
                    </h2>
                    <p className="text-neutral-500 dark:text-neutral-400">
                      {t("plants.noFieldPlantsDescription")}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {fieldPlants.map((fieldPlant) => (
                      <FieldPlantCard
                        key={fieldPlant.id}
                        fieldPlant={fieldPlant}
                        onUpdate={loadPlants}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
