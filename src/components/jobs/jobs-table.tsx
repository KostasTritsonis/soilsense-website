"use client";
import React from "react";
import { JobStatus } from "@/lib/types";
import StatusBadge from "./status-badge";
import { deleteJob, updateJobStatus } from "@/actions/index";
import { useJobsStore } from "@/lib/stores/jobs-store";
import { MapPin, Calendar, User, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function JobsTable() {
  const { jobs, updateJob, removeJob } = useJobsStore();
  const t = useTranslations();

  if (!jobs) return null;

  const header = [
    {
      label: t("jobs.job"),
    },
    {
      label: t("time.timeline"),
    },
    {
      label: t("jobs.jobStatus"),
    },
    {
      label: t("jobs.jobLocation"),
    },
    {
      label: t("jobs.jobAssignedTo"),
    },
    {
      label: t("common.actions"),
    },
    {
      label: t("common.delete"),
    },
  ];

  // Calculate days remaining or overdue
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

  // Handle status change
  const handleStatusChange = async (id: string, newStatus: string) => {
    updateJob(id, { status: newStatus as JobStatus });
    await updateJobStatus(id, newStatus as JobStatus);
  };

  // Calculate progress for timeline visualization
  const calculateProgress = (startDate: Date, endDate: Date) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();

    if (now <= start) return 0;
    if (now >= end) return 100;

    return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
  };

  const handleDelete = async (id: string) => {
    removeJob(id);
    await deleteJob(id);
  };

  if (jobs.length === 0) {
    return (
      <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-4 sm:p-6 md:p-8 text-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-neutral-100 dark:bg-neutral-700/80 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <Calendar className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-neutral-400 dark:text-neutral-500" />
        </div>
        <p className="text-base sm:text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 sm:mb-2">
          {t("jobs.noJobsFound")}
        </p>
        <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
          {t("jobs.createFirstJob")}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
            <thead className="bg-neutral-50/80 dark:bg-neutral-700/80">
              <tr>
                {header.map((header) => (
                  <th
                    key={header.label}
                    className="py-3 px-4 md:py-3.5 md:px-5 lg:py-4 lg:px-6 text-[10px] sm:text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider text-center"
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-800/50 divide-y divide-neutral-200 dark:divide-neutral-700">
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-neutral-50/50 dark:hover:bg-neutral-700/50 transition-colors"
                >
                  <td className="py-3 px-4 md:py-3.5 md:px-5 lg:py-4 lg:px-6">
                    <div className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {job.title}
                    </div>
                    <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 sm:mt-1">
                      {job.description}
                    </div>
                  </td>
                  <td className="py-3 px-4 md:py-3.5 md:px-5 lg:py-4 lg:px-6 text-center">
                    <div className="text-xs sm:text-sm text-neutral-900 dark:text-neutral-100">
                      {new Date(job.startDate).toLocaleDateString()} to{" "}
                      {new Date(job.endDate).toLocaleDateString()}
                    </div>
                    <div className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 sm:mt-1">
                      {getDaysRemaining(job.endDate, job.status)}
                    </div>
                    <div className="mx-auto mt-1.5 sm:mt-2 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded-full h-1.5 sm:h-2">
                      <div
                        className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                          job.status === "COMPLETED"
                            ? "bg-green-500"
                            : job.status === "DUE"
                            ? "bg-red-500"
                            : "bg-blue-500"
                        }`}
                        style={{
                          width: `${calculateProgress(
                            job.startDate,
                            job.endDate
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </td>
                  <td className="py-3 px-4 md:py-3.5 md:px-5 lg:py-4 lg:px-6 text-center">
                    <div className="flex justify-center">
                      <StatusBadge status={job.status} />
                    </div>
                  </td>
                  <td className="py-3 px-4 md:py-3.5 md:px-5 lg:py-4 lg:px-6 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 text-center">
                    {job.location || "Not specified"}
                  </td>
                  <td className="py-3 px-4 md:py-3.5 md:px-5 lg:py-4 lg:px-6 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 text-center">
                    {job.assignedTo?.name || "Unassigned"}
                  </td>
                  <td className="py-3 px-4 md:py-3.5 md:px-5 lg:py-4 lg:px-6 text-center">
                    <select
                      value={job.status}
                      onChange={(e) =>
                        handleStatusChange(job.id, e.target.value)
                      }
                      className="text-xs sm:text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-neutral-700 dark:text-neutral-100 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 mx-auto"
                    >
                      <option value="ONGOING">Ongoing</option>
                      <option value="DUE">Due</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 md:py-3.5 md:px-5 lg:py-4 lg:px-6 text-center">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="w-7 h-7 sm:w-8 sm:h-8 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3 sm:space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-3 sm:p-4 md:p-6"
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-0.5 sm:mb-1 truncate">
                  {job.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                  {job.description}
                </p>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-2">
                <StatusBadge status={job.status} />
                <button
                  onClick={() => handleDelete(job.id)}
                  className="w-7 h-7 sm:w-8 sm:h-8 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 dark:text-red-400" />
                </button>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {/* Timeline */}
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 md:p-3 bg-neutral-50/80 dark:bg-neutral-700/80 rounded-xl sm:rounded-2xl">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                    {new Date(job.startDate).toLocaleDateString()} -{" "}
                    {new Date(job.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400">
                    {getDaysRemaining(job.endDate, job.status)}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-1.5 sm:h-2">
                <div
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                    job.status === "COMPLETED"
                      ? "bg-green-500"
                      : job.status === "DUE"
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }`}
                  style={{
                    width: `${calculateProgress(job.startDate, job.endDate)}%`,
                  }}
                ></div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 md:p-3 bg-neutral-50/80 dark:bg-neutral-700/80 rounded-xl sm:rounded-2xl">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 dark:bg-green-900/30 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                    Location
                  </p>
                  <p className="text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400 truncate">
                    {job.location || "Not specified"}
                  </p>
                </div>
              </div>

              {/* Assigned To */}
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 md:p-3 bg-neutral-50/80 dark:bg-neutral-700/80 rounded-xl sm:rounded-2xl">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                    Assigned To
                  </p>
                  <p className="text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400 truncate">
                    {job.assignedTo?.name || "Unassigned"}
                  </p>
                </div>
              </div>

              {/* Status Change */}
              <div className="pt-1.5 sm:pt-2">
                <label className="block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 sm:mb-2">
                  Update Status
                </label>
                <select
                  value={job.status}
                  onChange={(e) => handleStatusChange(job.id, e.target.value)}
                  className="w-full text-xs sm:text-sm border border-neutral-300 dark:border-neutral-600 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-white dark:bg-neutral-700 dark:text-neutral-100 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20"
                >
                  <option value="ONGOING">Ongoing</option>
                  <option value="DUE">Due</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
