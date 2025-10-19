"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useFieldsStore } from "@/lib/stores/fields-store";
import { useJobsStore } from "@/lib/stores/jobs-store";

export default function StoreInitializer() {
  const { user } = useUser();
  const { fetchFields } = useFieldsStore();
  const { fetchJobs } = useJobsStore();

  useEffect(() => {
    if (user) {
      // Initialize both stores when user is authenticated
      fetchFields();
      fetchJobs();
    }
  }, [user, fetchFields, fetchJobs]);

  return null; // This component doesn't render anything
}
