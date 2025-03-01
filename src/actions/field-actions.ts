'use server';
import { prisma } from "@/lib/db";
import { Field } from "@/lib/types";
import { getTheCategorybyType } from "./index";
import getUser from "@/components/get-user";

export async function createField(data:Field) {
  const dbUser = await getUser();
  const category = await getTheCategorybyType(data.categories?.[0].type);

  if (!category) {
    throw new Error("Category not found");
  }
  try{
    await prisma.field.create({
      data: {
        id: data.id,
        color: data.color,
        area: data.area,
        label: data.label,
        coordinates: data.coordinates,
        authorId: dbUser.id,
        categories:{
          connect: {
            id: category.id
          }
        }
        
      },
    });
  
  return { success: true }; 
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: errorMessage }; 
  }
}

export async function getFieldsByUser() {
  const dbUser = await getUser();
  
  try {
    const fields = await prisma.field.findMany({
      where: { authorId: dbUser.id },
      include: { categories: true },
      orderBy: { label: "asc" },
    });

    if (!fields) {
      return null;
    }

    return fields.map((field) => ({
      id: field.id,
      color: field.color,
      area: field.area as number,
      coordinates: field.coordinates as number[][][],
      label: field.label as string,
      authorId: field.authorId,
      categories: field.categories,
    }));
  } catch (error) {
    console.error('Error fetching fields:', error);
    throw new Error("Fields not found");
  }
}

export async function deleteField(id: string) {
  try {
    await prisma.field.delete({ where: { id } });
    return { success: true, message: 'Field deleted successfully!' };
  } catch (error) {
    console.error('Error deleting field:', error);
    return { success: false, message: 'Failed to delete field' };
  }
}

export async function updateField(id: string, updates: Partial<Field>) {
  try {
    const categoryUpdates = updates.categories
      ? {
          set: updates.categories.map((cat) => ({ type: cat.type })) // Set new categories
        }
      : undefined;

    await prisma.field.update({
      where: { id },
      data:{
        color: updates.color,
        area: updates.area,
        label: updates.label,
        coordinates: updates.coordinates,
        categories: categoryUpdates,
      },
      include: { categories: true },
    })

    return { success: true };
  } catch (error) {
    console.error('Error updating field:', error);
    return { success: false, error };
  }
}

export async function getFieldById (id: string) {
  try{
    const field = await prisma.field.findUnique({
      where: { id },
      include: { categories: true },
    });
    if (!field) {
      return null;
    }
    return field;
  } catch (error) {
    console.error('Error fetching field:', error);
    throw new Error("Field not found");
  } 
};
