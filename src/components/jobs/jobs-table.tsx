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
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 p-8 text-center">
        <div className="w-16 h-16 bg-neutral-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-neutral-400" />
        </div>
        <p className="text-lg font-semibold text-neutral-700 mb-2">
          {t("jobs.noJobsFound")}
        </p>
        <p className="text-neutral-500">{t("jobs.createFirstJob")}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50/80">
              <tr>
                {header.map((header) => (
                  <th
                    key={header.label}
                    className="py-4 px-6 text-xs font-medium text-neutral-600 uppercase tracking-wider text-center"
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-neutral-50/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="text-sm font-semibold text-neutral-900">
                      {job.title}
                    </div>
                    <div className="text-sm text-neutral-500 mt-1">
                      {job.description}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-neutral-900">
                      {new Date(job.startDate).toLocaleDateString()} to{" "}
                      {new Date(job.endDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">
                      {getDaysRemaining(job.endDate, job.status)}
                    </div>
                    <div className="mx-auto mt-2 w-3/4 bg-neutral-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
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
                  <td className="py-4 px-6">
                    <div className="flex justify-center">
                      <StatusBadge status={job.status} />
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-neutral-600">
                    {job.location || "Not specified"}
                  </td>
                  <td className="py-4 px-6 text-sm text-neutral-600">
                    {job.assignedTo?.name || "Unassigned"}
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={job.status}
                      onChange={(e) =>
                        handleStatusChange(job.id, e.target.value)
                      }
                      className="text-sm border border-neutral-300 rounded-xl px-3 py-2 bg-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    >
                      <option value="ONGOING">Ongoing</option>
                      <option value="DUE">Due</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-xl flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                  {job.title}
                </h3>
                <p className="text-sm text-neutral-600">{job.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={job.status} />
                <button
                  onClick={() => handleDelete(job.id)}
                  className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-xl flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {/* Timeline */}
              <div className="flex items-center gap-3 p-3 bg-neutral-50/80 rounded-2xl">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-900">
                    {new Date(job.startDate).toLocaleDateString()} -{" "}
                    {new Date(job.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-neutral-600">
                    {getDaysRemaining(job.endDate, job.status)}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
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
              <div className="flex items-center gap-3 p-3 bg-neutral-50/80 rounded-2xl">
                <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    Location
                  </p>
                  <p className="text-xs text-neutral-600">
                    {job.location || "Not specified"}
                  </p>
                </div>
              </div>

              {/* Assigned To */}
              <div className="flex items-center gap-3 p-3 bg-neutral-50/80 rounded-2xl">
                <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
                  <User className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    Assigned To
                  </p>
                  <p className="text-xs text-neutral-600">
                    {job.assignedTo?.name || "Unassigned"}
                  </p>
                </div>
              </div>

              {/* Status Change */}
              <div className="pt-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Update Status
                </label>
                <select
                  value={job.status}
                  onChange={(e) => handleStatusChange(job.id, e.target.value)}
                  className="w-full text-sm border border-neutral-300 rounded-2xl px-4 py-3 bg-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
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
