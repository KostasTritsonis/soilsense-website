'use server';
import { prisma } from "@/lib/db";

export async function createCategory(type: string) {
  try{
    await prisma.category.create({
      data: { type },
    });
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: errorMessage }; 
  }
}

export async function getAllCategories() {
  try{
    const categories = await prisma.category.findMany();
    if (!categories) {
      throw new Error("Categories not found");
    }
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error("categories not found");
  }
}

export async function getTheCategorybyType(type: string | undefined) {
  try{
    const category = await prisma.category.findFirst(
      { where: { type } }
    );
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw new Error("category not found");
  }
}
