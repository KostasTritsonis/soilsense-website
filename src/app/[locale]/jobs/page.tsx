"use client";
import React, { useState, useCallback, useEffect } from "react";
import { AddCircle, CalendarToday, Close } from "@mui/icons-material";
import { Modal, Box, IconButton } from "@mui/material";
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { jobs } = useJobsStore();
  const { isSignedIn } = useUser();
  const t = useTranslations();

  // Check for dark mode class
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleJobSelect = useCallback((event: CalendarEvent) => {
    console.log("Selected job:", event.resource);
  }, []);

  return (
    <div className="w-full min-w-0 overflow-x-hidden overflow-y-auto">
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
      <Modal
        open={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        aria-labelledby="calendar-modal-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 3, md: 4 },
          backdropFilter: "blur(4px)",
        }}
      >
        <Box
          sx={{
            position: "relative",
            bgcolor: isDarkMode
              ? "rgba(38, 38, 38, 0.95)"
              : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(12px)",
            borderRadius: { xs: 2, sm: 3, md: 4 },
            boxShadow: 24,
            width: "100%",
            maxWidth: "1200px",
            height: { xs: "50vh", sm: "90vh" },
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "1px solid",
            borderColor: isDarkMode
              ? "rgba(64, 64, 64, 0.6)"
              : "rgba(255, 255, 255, 0.6)",
            outline: "none",
          }}
        >
          {/* Modal Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: { xs: 2, sm: 3, md: 4 },
              borderBottom: "1px solid",
              borderColor: isDarkMode
                ? "rgba(64, 64, 64, 1)"
                : "rgba(229, 231, 235, 1)",
              flexShrink: 0,
            }}
          >
            <Box
              component="h2"
              id="calendar-modal-title"
              sx={{
                fontSize: {
                  xs: "1rem",
                  sm: "1.125rem",
                  md: "1.25rem",
                  lg: "1.5rem",
                },
                fontWeight: 600,
                color: isDarkMode
                  ? "rgba(245, 245, 245, 1)"
                  : "rgba(23, 23, 23, 1)",
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, md: 1.5 },
                m: 0,
              }}
            >
              <CalendarToday
                sx={{
                  color: "#22c55e",
                  flexShrink: 0,
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                }}
              />
              <Box
                component="span"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                {t("jobs.jobs")} {t("time.today")}
              </Box>
            </Box>
            <IconButton
              onClick={() => setShowCalendarModal(false)}
              sx={{
                width: { xs: 28, sm: 32, md: 40 },
                height: { xs: 28, sm: 32, md: 40 },
                bgcolor: isDarkMode
                  ? "rgba(64, 64, 64, 1)"
                  : "rgba(243, 244, 246, 1)",
                color: isDarkMode
                  ? "rgba(163, 163, 163, 1)"
                  : "rgba(107, 114, 128, 1)",
                "&:hover": {
                  bgcolor: isDarkMode
                    ? "rgba(82, 82, 82, 1)"
                    : "rgba(229, 231, 235, 1)",
                },
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
          {/* Modal Content */}
          <Box
            sx={{
              flex: 1,
              overflow: "hidden",
              p: { xs: 1, sm: 2, md: 3, lg: 4 },
              minHeight: 0,
              bgcolor: "transparent",
            }}
          >
            <JobsCalendar jobs={jobs || []} onEventSelect={handleJobSelect} />
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
