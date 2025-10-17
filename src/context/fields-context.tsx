"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Field } from "@/lib/types";
import { getFieldsByUser } from "@/actions";
import { useUser } from "@clerk/nextjs";

// Define context type
interface FieldsContextType {
  fields: Field[];
  isLoading: boolean;
  tempFields: Field[];
  setFields: React.Dispatch<React.SetStateAction<Field[]>>;
  setTempFields: React.Dispatch<React.SetStateAction<Field[]>>;
}

// Create context
const FieldsContext = createContext<FieldsContextType | undefined>(undefined);

// Provider component
export function FieldsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [fields, setFields] = useState<Field[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tempFields, setTempFields] = useState<Field[]>([]);

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

    if (user) {
      fetchFields();
    }
  }, [user]);

  return (
    <FieldsContext.Provider
      value={{ fields, isLoading, tempFields, setTempFields, setFields }}
    >
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
