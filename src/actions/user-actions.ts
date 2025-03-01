'use server';
import { prisma } from "@/lib/db";

export async function createUser(name: string, email: string) {
  try{
    await prisma.user.create({
      data: { 
        name,
        email, 
      },
    });
  
    return { success: true }; 
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: errorMessage }; 
  }
}

export async function getUserByEmail(email: string) {
  if (!email) {
    console.log('No email provided');
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`No user found for email: ${email}`);
      return;
    }

    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user');
  }
}
