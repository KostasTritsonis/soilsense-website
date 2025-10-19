import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Plant {
  id: string;
  type: PlantType;
  plantingDate: Date;
  harvestDays: number;
  wateringFrequency: number; // days between watering
  lastWatered?: Date;
}

export type PlantType =
  | "basil"
  | "cherryTomato"
  | "cilantro"
  | "lettuce"
  | "mint"
  | "oregano"
  | "parsley"
  | "pepper"
  | "rosemary"
  | "spinach"
  | "thyme";

export interface PlantTypeInfo {
  name: string;
  harvestDays: number;
  wateringFrequency: number;
  icon: string;
}

export const PLANT_TYPES: Record<PlantType, PlantTypeInfo> = {
  basil: {
    name: "Basil",
    harvestDays: 60,
    wateringFrequency: 2,
    icon: "🌿",
  },
  cherryTomato: {
    name: "Cherry Tomato",
    harvestDays: 75,
    wateringFrequency: 3,
    icon: "🍅",
  },
  cilantro: {
    name: "Cilantro",
    harvestDays: 45,
    wateringFrequency: 2,
    icon: "🌿",
  },
  lettuce: {
    name: "Lettuce",
    harvestDays: 30,
    wateringFrequency: 1,
    icon: "🥬",
  },
  mint: {
    name: "Mint",
    harvestDays: 50,
    wateringFrequency: 2,
    icon: "🌿",
  },
  oregano: {
    name: "Oregano",
    harvestDays: 70,
    wateringFrequency: 3,
    icon: "🌿",
  },
  parsley: {
    name: "Parsley",
    harvestDays: 55,
    wateringFrequency: 2,
    icon: "🌿",
  },
  pepper: {
    name: "Pepper",
    harvestDays: 80,
    wateringFrequency: 3,
    icon: "🌶️",
  },
  rosemary: {
    name: "Rosemary",
    harvestDays: 90,
    wateringFrequency: 4,
    icon: "🌿",
  },
  spinach: {
    name: "Spinach",
    harvestDays: 40,
    wateringFrequency: 2,
    icon: "🥬",
  },
  thyme: {
    name: "Thyme",
    harvestDays: 65,
    wateringFrequency: 3,
    icon: "🌿",
  },
};

interface PlantsStore {
  plants: Plant[];
  addPlant: (plant: Omit<Plant, "id">) => void;
  removePlant: (id: string) => void;
  waterPlant: (id: string) => void;
  getPlantProgress: (plant: Plant) => number; // returns percentage 0-100
  getDaysUntilHarvest: (plant: Plant) => number;
  getDaysSinceLastWatered: (plant: Plant) => number;
}

export const usePlantsStore = create<PlantsStore>()(
  persist(
    (set) => ({
      plants: [],

      addPlant: (plantData) => {
        const newPlant: Plant = {
          ...plantData,
          id: Date.now().toString(),
        };
        set((state) => ({
          plants: [...state.plants, newPlant],
        }));
      },

      removePlant: (id) => {
        set((state) => ({
          plants: state.plants.filter((plant) => plant.id !== id),
        }));
      },

      waterPlant: (id) => {
        set((state) => ({
          plants: state.plants.map((plant) =>
            plant.id === id ? { ...plant, lastWatered: new Date() } : plant
          ),
        }));
      },

      getPlantProgress: (plant) => {
        const plantingDate = new Date(plant.plantingDate);
        const daysSincePlanting = Math.floor(
          (new Date().getTime() - plantingDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );
        return Math.min((daysSincePlanting / plant.harvestDays) * 100, 100);
      },

      getDaysUntilHarvest: (plant) => {
        const plantingDate = new Date(plant.plantingDate);
        const daysSincePlanting = Math.floor(
          (new Date().getTime() - plantingDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );
        return Math.max(plant.harvestDays - daysSincePlanting, 0);
      },

      getDaysSinceLastWatered: (plant) => {
        if (!plant.lastWatered) return 0;
        const lastWateredDate = new Date(plant.lastWatered);
        return Math.floor(
          (new Date().getTime() - lastWateredDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );
      },
    }),
    {
      name: "plants-storage",
    }
  )
);
