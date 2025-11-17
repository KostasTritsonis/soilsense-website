"use server";
import { prisma } from "@/lib/db";
import getUser from "@/components/get-user";
import { PlantType } from "@/lib/stores/plants-store";

export interface IndoorPlantData {
  id: string;
  type: PlantType;
  plantingDate: Date;
  harvestDays: number;
  wateringFrequency: number;
  lastWatered?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FieldPlantData {
  id: string;
  fieldId: string;
  fieldLabel: string;
  fieldColor: string;
  plantType: string;
  categoryId: string;
  plantingDate?: Date | null;
  harvestDays?: number | null;
  wateringFrequency?: number | null;
  lastWatered?: Date | null;
  lastFertilized?: Date | null;
  fertilizerFrequency?: number | null;
  fieldPlantId?: string; // The actual FieldPlant record ID if it exists
}

export async function getIndoorPlantsByUser() {
  const dbUser = await getUser();

  try {
    const plants = await prisma.indoorPlant.findMany({
      where: { authorId: dbUser.id },
      orderBy: { plantingDate: "desc" },
    });

    return plants.map((plant) => ({
      id: plant.id,
      type: plant.type as PlantType,
      plantingDate: plant.plantingDate,
      harvestDays: plant.harvestDays,
      wateringFrequency: plant.wateringFrequency,
      lastWatered: plant.lastWatered,
      createdAt: plant.createdAt,
      updatedAt: plant.updatedAt,
    }));
  } catch (error) {
    console.error("Error fetching indoor plants:", error);
    throw new Error("Indoor plants not found");
  }
}

export async function createIndoorPlant(data: {
  type: PlantType;
  plantingDate: Date;
  harvestDays: number;
  wateringFrequency: number;
  lastWatered?: Date;
}) {
  const dbUser = await getUser();

  try {
    const plant = await prisma.indoorPlant.create({
      data: {
        type: data.type,
        plantingDate: data.plantingDate,
        harvestDays: data.harvestDays,
        wateringFrequency: data.wateringFrequency,
        lastWatered: data.lastWatered,
        authorId: dbUser.id,
      },
    });

    return {
      success: true,
      plant: {
        id: plant.id,
        type: plant.type as PlantType,
        plantingDate: plant.plantingDate,
        harvestDays: plant.harvestDays,
        wateringFrequency: plant.wateringFrequency,
        lastWatered: plant.lastWatered,
        createdAt: plant.createdAt,
        updatedAt: plant.updatedAt,
      },
    };
  } catch (error) {
    console.error("Error creating indoor plant:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return { success: false, error: errorMessage };
  }
}

export async function deleteIndoorPlant(id: string) {
  const dbUser = await getUser();

  try {
    // Verify the plant belongs to the user
    const plant = await prisma.indoorPlant.findUnique({
      where: { id },
    });

    if (!plant || plant.authorId !== dbUser.id) {
      return { success: false, error: "Plant not found or unauthorized" };
    }

    await prisma.indoorPlant.delete({
      where: { id },
    });

    return { success: true, message: "Indoor plant deleted successfully!" };
  } catch (error) {
    console.error("Error deleting indoor plant:", error);
    return { success: false, message: "Failed to delete indoor plant" };
  }
}

export async function waterIndoorPlant(id: string) {
  const dbUser = await getUser();

  try {
    // Verify the plant belongs to the user
    const plant = await prisma.indoorPlant.findUnique({
      where: { id },
    });

    if (!plant || plant.authorId !== dbUser.id) {
      return { success: false, error: "Plant not found or unauthorized" };
    }

    const updatedPlant = await prisma.indoorPlant.update({
      where: { id },
      data: {
        lastWatered: new Date(),
      },
    });

    return {
      success: true,
      plant: {
        id: updatedPlant.id,
        type: updatedPlant.type as PlantType,
        plantingDate: updatedPlant.plantingDate,
        harvestDays: updatedPlant.harvestDays,
        wateringFrequency: updatedPlant.wateringFrequency,
        lastWatered: updatedPlant.lastWatered,
        createdAt: updatedPlant.createdAt,
        updatedAt: updatedPlant.updatedAt,
      },
    };
  } catch (error) {
    console.error("Error watering indoor plant:", error);
    return { success: false, error: "Failed to water plant" };
  }
}

export async function getFieldPlantsByUser(): Promise<FieldPlantData[]> {
  const dbUser = await getUser();

  try {
    const fields = await prisma.field.findMany({
      where: { authorId: dbUser.id },
      include: {
        categories: true,
      },
      orderBy: { label: "asc" },
    });

    // Get all field plants for this user
    const allFieldPlants = await prisma.fieldPlant.findMany({
      where: { authorId: dbUser.id },
    });

    // Transform fields with categories into field plants
    type FieldWithCategories = {
      id: string;
      label: string | null;
      color: string;
      categories: Array<{ id: string; type: string }>;
    };

    type FieldPlantRecord = {
      id: string;
      fieldId: string;
      categoryId: string;
      plantingDate: Date;
      harvestDays: number;
      wateringFrequency: number;
      lastWatered: Date | null;
      lastFertilized: Date | null;
      fertilizerFrequency: number | null;
    };

    const fieldPlants = (fields as unknown as FieldWithCategories[])
      .filter((field) => field.categories && field.categories.length > 0)
      .flatMap((field) =>
        field.categories.map((category) => {
          // Find matching FieldPlant record if it exists
          const fieldPlant = (
            allFieldPlants as unknown as FieldPlantRecord[]
          ).find(
            (fp) => fp.fieldId === field.id && fp.categoryId === category.id
          );

          return {
            id: `${field.id}-${category.id}`,
            fieldId: field.id,
            fieldLabel: field.label || "Unnamed Field",
            fieldColor: field.color,
            plantType: category.type,
            categoryId: category.id,
            plantingDate: fieldPlant?.plantingDate || null,
            harvestDays: fieldPlant?.harvestDays || null,
            wateringFrequency: fieldPlant?.wateringFrequency || null,
            lastWatered: fieldPlant?.lastWatered || null,
            lastFertilized: fieldPlant?.lastFertilized || null,
            fertilizerFrequency: fieldPlant?.fertilizerFrequency || null,
            fieldPlantId: fieldPlant?.id,
          };
        })
      );

    return fieldPlants;
  } catch (error) {
    console.error("Error fetching field plants:", error);
    throw new Error("Field plants not found");
  }
}

export async function createOrUpdateFieldPlant(data: {
  fieldId: string;
  categoryId: string;
  plantingDate: Date;
  harvestDays: number;
  wateringFrequency: number;
  fertilizerFrequency?: number;
}) {
  const dbUser = await getUser();

  try {
    // Verify the field belongs to the user
    const field = await prisma.field.findUnique({
      where: { id: data.fieldId },
    });

    if (!field || field.authorId !== dbUser.id) {
      return { success: false, error: "Field not found or unauthorized" };
    }

    // Check if FieldPlant already exists

    const existing = await prisma.fieldPlant.findUnique({
      where: {
        fieldId_categoryId: {
          fieldId: data.fieldId,
          categoryId: data.categoryId,
        },
      },
    });

    let fieldPlant;
    if (existing) {
      // Update existing

      fieldPlant = await prisma.fieldPlant.update({
        where: { id: existing.id },
        data: {
          plantingDate: data.plantingDate,
          harvestDays: data.harvestDays,
          wateringFrequency: data.wateringFrequency,
          fertilizerFrequency: data.fertilizerFrequency,
        },
        include: {
          field: true,
          category: true,
        },
      });
    } else {
      // Create new

      fieldPlant = await prisma.fieldPlant.create({
        data: {
          fieldId: data.fieldId,
          categoryId: data.categoryId,
          plantingDate: data.plantingDate,
          harvestDays: data.harvestDays,
          wateringFrequency: data.wateringFrequency,
          fertilizerFrequency: data.fertilizerFrequency,
          authorId: dbUser.id,
        },
        include: {
          field: true,
          category: true,
        },
      });
    }

    return {
      success: true,
      fieldPlant: {
        id: fieldPlant.id,
        fieldId: fieldPlant.fieldId,
        categoryId: fieldPlant.categoryId,
        plantingDate: fieldPlant.plantingDate,
        harvestDays: fieldPlant.harvestDays,
        wateringFrequency: fieldPlant.wateringFrequency,
        lastWatered: fieldPlant.lastWatered,
        lastFertilized: fieldPlant.lastFertilized,
        fertilizerFrequency: fieldPlant.fertilizerFrequency,
      },
    };
  } catch (error) {
    console.error("Error creating/updating field plant:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return { success: false, error: errorMessage };
  }
}

export async function waterFieldPlant(fieldPlantId: string) {
  const dbUser = await getUser();

  try {
    const fieldPlant = await prisma.fieldPlant.findUnique({
      where: { id: fieldPlantId },
    });

    if (!fieldPlant || fieldPlant.authorId !== dbUser.id) {
      return { success: false, error: "Field plant not found or unauthorized" };
    }

    const updated = await prisma.fieldPlant.update({
      where: { id: fieldPlantId },
      data: {
        lastWatered: new Date(),
      },
    });

    return { success: true, fieldPlant: updated };
  } catch (error) {
    console.error("Error watering field plant:", error);
    return { success: false, error: "Failed to water field plant" };
  }
}

export async function fertilizeFieldPlant(fieldPlantId: string) {
  const dbUser = await getUser();

  try {
    const fieldPlant = await prisma.fieldPlant.findUnique({
      where: { id: fieldPlantId },
    });

    if (!fieldPlant || fieldPlant.authorId !== dbUser.id) {
      return { success: false, error: "Field plant not found or unauthorized" };
    }

    const updated = await prisma.fieldPlant.update({
      where: { id: fieldPlantId },
      data: {
        lastFertilized: new Date(),
      },
    });

    return { success: true, fieldPlant: updated };
  } catch (error) {
    console.error("Error fertilizing field plant:", error);
    return { success: false, error: "Failed to fertilize field plant" };
  }
}
