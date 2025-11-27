"use client";
import React, { useState, useCallback, useEffect } from "react";
import { AddCircle, CalendarToday, Close } from "@mui/icons-material";
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
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const { jobs } = useJobsStore();
  const { isSignedIn } = useUser();
  const t = useTranslations();

  const handleJobSelect = useCallback((event: CalendarEvent) => {
    console.log("Selected job:", event.resource);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showCalendarModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showCalendarModal]);

  return (
    <div className="w-full min-w-0 h-full overflow-x-hidden overflow-y-auto">
      {/* Header Section */}
      <div className="pb-4 md:pb-6 lg:pb-8 min-w-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 md:gap-4 min-w-0">
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-neutral-900 dark:text-neutral-100 pb-1 md:pb-2 break-words">
              {t("jobs.jobs")}
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-neutral-600 dark:text-neutral-400 break-words">
              {t("jobs.jobFormDescription")}
            </p>
          </div>
          <button
            onClick={() => setShowJobForm(!showJobForm)}
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white dark:text-neutral-100 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl font-semibold transition-colors shadow-soft hover:shadow-medium w-full sm:w-auto text-sm md:text-base flex-shrink-0"
          >
            <AddCircle fontSize="small" />
            <span>{t("jobs.createJob")}</span>
          </button>
        </div>
      </div>

      {!isSignedIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-large border border-white/60 max-w-sm w-full">
            <p className="text-base md:text-lg text-neutral-900 dark:text-neutral-100 font-semibold text-center">
              {t("fields.pleaseSignInMap")}
            </p>
          </div>
        </div>
      )}

      {/* Job Form */}
      {showJobForm && (
        <div className="pb-4 md:pb-6 lg:pb-8">
          <JobForm onCancel={() => setShowJobForm(false)} />
        </div>
      )}

      {/* Jobs Table */}
      <section className="pb-4 md:pb-6 lg:pb-8">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-neutral-900 dark:text-neutral-100 pb-3 md:pb-4 lg:pb-6">
          {t("dashboard.activeJobs")}
        </h2>
        <JobsTable />
      </section>

      {/* Calendar Section */}
      <section className="pb-4 md:pb-6">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-neutral-900 dark:text-neutral-100 pb-3 md:pb-4 lg:pb-6 flex items-center gap-2 md:gap-3">
          <CalendarToday
            className="text-primary-600 dark:text-primary-400 flex-shrink-0"
            fontSize="medium"
          />
          <span className="truncate">
            {t("jobs.jobs")} {t("time.today")}
          </span>
        </h2>
        <button
          onClick={() => setShowCalendarModal(true)}
          className="w-full flex items-center justify-center gap-2 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-4 md:px-6 py-4 md:py-6 rounded-2xl md:rounded-3xl font-semibold transition-colors shadow-soft hover:shadow-medium border border-white/60 dark:border-neutral-700/60"
        >
          <CalendarToday
            className="text-primary-600 dark:text-primary-400"
            fontSize="medium"
          />
          <span className="text-sm md:text-base lg:text-lg">
            {t("jobs.viewCalendar")}
          </span>
        </button>
      </section>

      {/* Calendar Modal */}
      {showCalendarModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCalendarModal(false);
            }
          }}
        >
          <div className="bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-large border border-white/60 dark:border-neutral-700/60 w-full max-w-7xl h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-neutral-200 dark:border-neutral-700 flex-shrink-0">
              <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 md:gap-3">
                <CalendarToday
                  className="text-primary-600 dark:text-primary-400 flex-shrink-0"
                  fontSize="medium"
                />
                <span className="truncate">
                  {t("jobs.jobs")} {t("time.today")}
                </span>
              </h2>
              <button
                onClick={() => setShowCalendarModal(false)}
                className="w-8 h-8 md:w-10 md:h-10 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
              >
                <Close
                  className="text-neutral-600 dark:text-neutral-400"
                  fontSize="small"
                />
              </button>
            </div>
            {/* Modal Content */}
            <div className="flex-1 overflow-hidden p-4 md:p-6 min-h-0">
              <div className="h-full w-full">
                <JobsCalendar
                  jobs={jobs || []}
                  onEventSelect={handleJobSelect}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
