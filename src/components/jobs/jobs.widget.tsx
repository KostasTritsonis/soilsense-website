import { useJobsStore } from "@/lib/stores/jobs-store";
import { JobStatus } from "@prisma/client";
import { ArrowRightIcon, MapPin, Clock, User } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useLocale, useTranslations } from "next-intl";

export default function JobsWidget() {
  const { jobs } = useJobsStore();
  const sortedJobs = jobs?.filter((job) => job.status === "DUE");
  const locale = useLocale();
  const t = useTranslations();

  const getDaysRemaining = (endDate: Date, status: JobStatus) => {
    const today = new Date();
    const diffTime = new Date(endDate).getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      if (status === "COMPLETED") return t("jobs.completed");
      return `${Math.abs(diffDays)} ${t("time.days")} ${t("jobs.overdue")}`;
    } else if (diffDays === 0) {
      return t("jobs.dueToday");
    } else {
      return `${diffDays} ${t("time.days")} ${t("jobs.remaining")}`;
    }
  };

  return (
    <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl md:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-3 sm:p-4 md:p-5 lg:p-6 min-w-0">
      <div className="flex items-center justify-between pb-2 sm:pb-3 md:pb-4">
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-neutral-900 dark:text-neutral-100 truncate">
            {t("jobs.dueJobs")}
          </h2>
        </div>
        <Link
          href={`/${locale}/jobs`}
          className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs md:text-sm text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors flex-shrink-0 ml-1.5 sm:ml-2"
        >
          <span className="hidden sm:inline">{t("weather.viewAll")}</span>
          <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5" />
        </Link>
      </div>

      <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
        {sortedJobs?.map((job) => (
          <div
            key={job.id}
            className="p-2 sm:p-2.5 md:p-3 lg:p-4 bg-neutral-50/80 dark:bg-neutral-700/80 rounded-lg sm:rounded-xl md:rounded-2xl border border-neutral-100 dark:border-neutral-600/60 hover:bg-neutral-100/80 dark:hover:bg-neutral-600/80 transition-colors"
          >
            <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
              {/* Job Title and Status */}
              <div className="flex items-start justify-between gap-1.5 sm:gap-2 md:gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-[10px] sm:text-xs md:text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                    {job.title}
                  </h3>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[9px] sm:text-[10px] md:text-xs font-medium text-orange-600 dark:text-orange-400">
                    {getDaysRemaining(job.endDate, job.status)}
                  </p>
                </div>
              </div>

              {/* Job Details */}
              <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                {/* Location */}
                <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 text-[9px] sm:text-[10px] md:text-xs text-neutral-600 dark:text-neutral-400">
                  <MapPin className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 flex-shrink-0" />
                  <span className="truncate">
                    {job.location || t("jobs.noLocationSpecified")}
                  </span>
                </div>

                {/* Assigned To */}
                <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 text-[9px] sm:text-[10px] md:text-xs text-neutral-600 dark:text-neutral-400">
                  <User className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 flex-shrink-0" />
                  <span className="truncate">
                    {job.assignedTo?.name || t("jobs.unassigned")}
                  </span>
                </div>

                {/* Description */}
                {job.description && (
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                    {job.description}
                  </p>
                )}
              </div>

              {/* Timeline */}
              <div className="pt-1 sm:pt-1.5 md:pt-2 border-t border-neutral-200 dark:border-neutral-600">
                <div className="flex items-center justify-between text-[9px] sm:text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="truncate">
                    {new Date(job.startDate).toLocaleDateString()} -{" "}
                    {new Date(job.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {sortedJobs?.length === 0 && (
          <div className="py-4 sm:py-6 md:py-8 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium">
              No jobs due
            </p>
            <p className="text-[10px] sm:text-xs text-neutral-400 dark:text-neutral-500">
              All caught up!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
