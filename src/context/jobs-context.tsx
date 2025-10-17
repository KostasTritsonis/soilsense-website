"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Job, User } from "@/lib/types";
import { getJobs, getUsers } from "@/actions";
import { useUser } from "@clerk/nextjs";

// Define context type
interface JobsContextType {
  jobs: Job[] | undefined;
  users: User[] | undefined;
  isLoading: boolean;
  setJobs: React.Dispatch<React.SetStateAction<Job[] | undefined>>;
  setUsers: React.Dispatch<React.SetStateAction<User[] | undefined>>;
}

// Create context
const JobsContext = createContext<JobsContextType | undefined>(undefined);

// Provider component
export function JobsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [jobs, setJobs] = useState<Job[] | undefined>([]);
  const [users, setUsers] = useState<User[] | undefined>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const jobsResult = await getJobs();
        const usersResult = await getUsers();
        if (jobsResult.success) setJobs(jobsResult.jobs);
        if (usersResult.success) setUsers(usersResult.users);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchJobs();
    }
  }, [user]);

  return (
    <JobsContext.Provider value={{ jobs, users, isLoading, setJobs, setUsers }}>
      {children}
    </JobsContext.Provider>
  );
}

// Hook to use jobs context
export function useJobs() {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error("useJobs must be used within a JobsProvider");
  }
  return context;
}
