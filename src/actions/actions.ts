'use server';
import { prisma } from "@/lib/db";
import { Polygon } from "@/lib/types";

export async function createPolygon(data: Polygon) {
  try {
    await prisma.polygon.create({ 
      data: {
        id: data.id,
        color: data.color,
        area: data.area,
        label: data.label,
        coordinates: data.coordinates
      }
    });

    return { success: true }; // ✅ Ensure a response is returned
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: errorMessage }; // ✅ Return an error response
  }
  
}

export async function deletePolygon(id: string) {
  try {
    await prisma.polygon.delete({ where: { id } });
    return { success: true, message: 'Polygon deleted successfully!' };
  } catch (error) {
    console.error('Error deleting polygon:', error);
    return { success: false, message: 'Failed to delete polygon' };
  }
}

export async function getPolygons() {
  try {
    const polygons = await prisma.polygon.findMany();
    console.log(polygons);
    return polygons.map((polygon) => ({
      id: polygon.id,
      color: polygon.color,
      area: polygon.area,
      coordinates: polygon.coordinates  as number[][][], // Convert stored JSON string to array
      label: polygon.label,
    }));
  } catch (error) {
    console.error('Error fetching polygons:', error);
    return [];
  }
}

export async function updatePolygon(id: string, updates: Partial<Polygon>) {
  try {
    await prisma.polygon.update({
      where: { id },
      data: updates,
    })

    return { success: true };
  } catch (error) {
    console.error('Error updating polygon:', error);
    return { success: false, error };
  }
}


export async function getPolygonById (id: string) {
  try{
     return await prisma.polygon.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error('Error fetching polygon:', error);
    return { success: false, error };
  } 
};

