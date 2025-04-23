'use server'
import { prisma } from '@/lib/db';
import { JobFormData, JobStatus } from '@/lib/types';

// Create a new job
export async function createJob(data: JobFormData) {
  try {
    const job = await prisma.job.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        assignedToId: data.assignedToId,
      },
    });
    return { success: true, job };
  } catch (error) {
    console.error('Failed to create job:', error);
    return { success: false, error: 'Failed to create job' };
  }
}

// Get all jobs
export async function getJobs() {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        assignedTo: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
    
    return { success: true, jobs };
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    return { success: false, error: 'Failed to fetch jobs' };
  }
}

// Update job status
export async function updateJobStatus(id: string, status: JobStatus) {
  try {
    const job = await prisma.job.update({
      where: { id },
      data: { status },
    });
    
    return { success: true, job };
  } catch (error) {
    console.error('Failed to update job status:', error);
    return { success: false, error: 'Failed to update job status' };
  }
}


export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    
    return { success: true, users };
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return { success: false, error: 'Failed to fetch users' };
  }
}

export async function deleteJob(id: string) {
  try {
    await prisma.job.delete({ where: { id } });
    return { success: true, message: 'Job deleted successfully!' };
  } catch (error) {
    console.error('Error deleting job:', error);
    return { success: false, error: 'Failed to delete job' };
  }
}
