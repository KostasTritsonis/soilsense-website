"use client";
import React, { useState, useCallback } from "react";
import { PlusCircle, Calendar as CalendarIcon } from "lucide-react";
import JobsTable from "@/components/jobs/jobs-table";
import JobForm from "@/components/jobs/jobs-form";
import JobsCalendar from "@/components/jobs/jobs-calendar";
import { useUser } from "@clerk/nextjs";
import { useJobsStore } from "@/lib/stores/jobs-store";
import { Job } from "@/lib/types";
import { useTranslations } from "next-intl";

interface CalendarEvent {
  title: string;
  start: Date;
  color: string;
  end: Date;
  resource: Job;
}

export default function Page() {
  const [showJobForm, setShowJobForm] = useState(false);
  const { jobs } = useJobsStore();
  const { isSignedIn } = useUser();
  const t = useTranslations();

  const handleJobSelect = useCallback((event: CalendarEvent) => {
    console.log("Selected job:", event.resource);
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="pb-6 md:pb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-neutral-900 pb-2">
              {t("jobs.jobs")}
            </h1>
            <p className="text-base md:text-lg text-neutral-600">
              {t("jobs.jobFormDescription")}
            </p>
          </div>
          <button
            onClick={() => setShowJobForm(!showJobForm)}
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 md:px-6 py-3 rounded-2xl font-semibold transition-colors shadow-soft hover:shadow-medium w-full sm:w-auto"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="hidden sm:inline">{t("jobs.createJob")}</span>
            <span className="sm:hidden">{t("jobs.createJob")}</span>
          </button>
        </div>
      </div>

      {!isSignedIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-large border border-white/60 max-w-sm w-full">
            <p className="text-base md:text-lg text-neutral-900 font-semibold text-center">
              {t("fields.pleaseSignInMap")}
            </p>
          </div>
        </div>
      )}

      {/* Job Form */}
      {showJobForm && (
        <div className="pb-6 md:pb-8">
          <JobForm onCancel={() => setShowJobForm(false)} />
        </div>
      )}

      {/* Jobs Table */}
      <section className="pb-6 md:pb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 pb-4 md:pb-6">
          {t("dashboard.activeJobs")}
        </h2>
        <JobsTable />
      </section>

      {/* Calendar Section */}
      <section className="pb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 pb-4 md:pb-6 flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
          {t("jobs.jobs")} {t("time.today")}
        </h2>
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 overflow-hidden">
          <div className="h-[500px] md:h-[600px] lg:h-[700px] p-4 md:p-6">
            <JobsCalendar jobs={jobs || []} onEventSelect={handleJobSelect} />
          </div>
        </div>
      </section>
    </div>
  );
}
