// Mapping for field plant types (crops) to their display information
export interface FieldPlantTypeInfo {
  name: string;
  icon: string; // 3D emoji or can be replaced with 3D image URL
  imageUrl?: string; // Optional 3D image URL
  harvestDays: number;
  wateringFrequency: number; // days between watering
  fertilizerFrequency: number; // days between fertilizing
}

export const FIELD_PLANT_TYPES: Record<string, FieldPlantTypeInfo> = {
  Wheat: {
    name: "Wheat",
    icon: "🌾",
    harvestDays: 120,
    wateringFrequency: 7,
    fertilizerFrequency: 30,
  },
  Corn: {
    name: "Corn",
    icon: "🌽",
    harvestDays: 90,
    wateringFrequency: 5,
    fertilizerFrequency: 21,
  },
  Tomato: {
    name: "Tomato",
    icon: "🍅",
    harvestDays: 75,
    wateringFrequency: 3,
    fertilizerFrequency: 14,
  },
  Olive: {
    name: "Olive",
    icon: "🫒",
    imageUrl: "/olive.png",
    harvestDays: 180,
    wateringFrequency: 10,
    fertilizerFrequency: 60,
  },
  Rice: {
    name: "Rice",
    icon: "🌾",
    harvestDays: 120,
    wateringFrequency: 1,
    fertilizerFrequency: 30,
  },
  Soybean: {
    name: "Soybean",
    icon: "🫘",
    harvestDays: 100,
    wateringFrequency: 5,
    fertilizerFrequency: 25,
  },
  Potato: {
    name: "Potato",
    icon: "🥔",
    harvestDays: 90,
    wateringFrequency: 4,
    fertilizerFrequency: 20,
  },
  Carrot: {
    name: "Carrot",
    icon: "🥕",
    harvestDays: 70,
    wateringFrequency: 3,
    fertilizerFrequency: 21,
  },
  Lettuce: {
    name: "Lettuce",
    icon: "🥬",
    harvestDays: 45,
    wateringFrequency: 2,
    fertilizerFrequency: 14,
  },
  Onion: {
    name: "Onion",
    icon: "🧅",
    harvestDays: 100,
    wateringFrequency: 4,
    fertilizerFrequency: 30,
  },
  Cotton: {
    name: "Cotton",
    icon: "🌱",
    harvestDays: 150,
    wateringFrequency: 7,
    fertilizerFrequency: 45,
  },
};

export function getFieldPlantTypeInfo(plantType: string): FieldPlantTypeInfo {
  return (
    FIELD_PLANT_TYPES[plantType] || {
      name: plantType,
      icon: "🌱",
      harvestDays: 90,
      wateringFrequency: 5,
      fertilizerFrequency: 21,
    }
  );
}
