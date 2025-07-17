import { useFields } from "@/context/fields-context";
import { JobStatus } from "@prisma/client";
import { ArrowRightIcon, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function JobsWidget() {
  const { jobs } = useFields();
  const sortedJobs = jobs?.filter((job) => job.status === "DUE");

  const getDaysRemaining = (endDate: Date, status: JobStatus) => {
    const today = new Date();
    const diffTime = new Date(endDate).getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      if (status === "COMPLETED") return "Completed";
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return "Due today";
    } else {
      return `${diffDays} days remaining`;
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 p-6">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <h2 className="text-lg font-semibold text-neutral-900">Due Jobs</h2>
        </div>
        <Link
          href="/jobs"
          className="flex items-center gap-1 text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors"
        >
          View all
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {sortedJobs?.map((job) => (
          <div
            key={job.id}
            className="p-4 bg-neutral-50/80 rounded-2xl border border-neutral-100"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-neutral-900 pb-1">
                  {job.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-neutral-600 pb-1">
                  <MapPin className="w-3 h-3" />
                  <span>{job.location}</span>
                </div>
                <p className="text-xs text-neutral-500">
                  Assigned to: {job.assignedTo?.name || "Unassigned"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-orange-600">
                  {getDaysRemaining(job.endDate, job.status)}
                </p>
              </div>
            </div>
          </div>
        ))}
        {sortedJobs?.length === 0 && (
          <div className="py-8 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-neutral-500">No jobs due</p>
            <p className="text-xs text-neutral-400">All caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
