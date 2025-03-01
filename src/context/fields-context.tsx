"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Field, Job, User } from "@/lib/types";
import { getFieldsByUser, getJobs, getUsers } from "@/actions";
import { useUser } from "@clerk/nextjs";

// Define context type
interface FieldsContextType {
  fields: Field[];
  isLoading: boolean;
  jobs: Job[] | undefined;
  users: User[] | undefined;
  setFields: React.Dispatch<React.SetStateAction<Field[]>>;
  setJobs: React.Dispatch<React.SetStateAction<Job[] | undefined>>;
  setUsers: React.Dispatch<React.SetStateAction<User[] | undefined>>;
}

// Create context
const FieldsContext = createContext<FieldsContextType | undefined>(undefined);

// Provider component
export function FieldsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [fields, setFields] = useState<Field[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [jobs,setJobs] = useState<Job[] | undefined>([]);
  const [users,setUsers] = useState<User[] | undefined>([]);

  useEffect(() => {
    const fetchFields = async () => {
      setIsLoading(true);
      try {
        const fetchedFields = await getFieldsByUser();
        setFields(fetchedFields ?? []);
      } catch (error) {
        console.error("Error fetching fields:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchJobs = async () => {
          const jobsResult = await getJobs();
          const usersResult = await getUsers();
          if (jobsResult.success) setJobs(jobsResult.jobs);
          if (usersResult.success) setUsers(usersResult.users);
        };

    if (user) fetchFields(); fetchJobs();
  }, [user]);

  return (
    <FieldsContext.Provider value={{ fields, isLoading, jobs, users, setFields, setJobs, setUsers }}>
      {children}
    </FieldsContext.Provider>
  );
}

// Hook to use fields context
export function useFields() {
  const context = useContext(FieldsContext);
  if (!context) {
    throw new Error("useFields must be used within a FieldsProvider");
  }
  return context;
}