import { create } from "zustand";
import { Job, User } from "@/lib/types";
import { getJobs, getUsers } from "@/actions";

interface JobsState {
  jobs: Job[] | undefined;
  users: User[] | undefined;
  isLoading: boolean;

  // Actions
  setJobs: (jobs: Job[] | undefined) => void;
  setUsers: (users: User[] | undefined) => void;
  setIsLoading: (loading: boolean) => void;
  fetchJobs: () => Promise<void>;
  addJob: (job: Job) => void;
  updateJob: (id: string, job: Partial<Job>) => void;
  removeJob: (id: string) => void;
  clearJobs: () => void;
}

export const useJobsStore = create<JobsState>((set) => ({
  // Initial state
  jobs: undefined,
  users: undefined,
  isLoading: true,

  // Actions
  setJobs: (jobs: Job[] | undefined) => set({ jobs }),

  setUsers: (users: User[] | undefined) => set({ users }),

  setIsLoading: (isLoading: boolean) => set({ isLoading }),

  fetchJobs: async () => {
    set({ isLoading: true });
    try {
      const jobsResult = await getJobs();
      const usersResult = await getUsers();

      if (jobsResult.success) {
        set({ jobs: jobsResult.jobs });
      }
      if (usersResult.success) {
        set({ users: usersResult.users });
      }
      set({ isLoading: false });
    } catch (error) {
      console.error("Error fetching jobs:", error);
      set({ isLoading: false });
    }
  },

  addJob: (job: Job) => {
    set((state) => ({
      jobs: state.jobs ? [...state.jobs, job] : [job],
    }));
  },

  updateJob: (id: string, jobData: Partial<Job>) => {
    set((state) => ({
      jobs: state.jobs?.map((job) =>
        job.id === id ? { ...job, ...jobData } : job
      ),
    }));
  },

  removeJob: (id: string) => {
    set((state) => ({
      jobs: state.jobs?.filter((job) => job.id !== id),
    }));
  },

  clearJobs: () => set({ jobs: undefined, users: undefined }),
}));
