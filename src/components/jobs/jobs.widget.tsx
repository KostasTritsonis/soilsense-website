import { useFields } from "@/context/fields-context";
import { JobStatus } from "@prisma/client";
import { ArrowRightIcon, MapPin } from "lucide-react";
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
    <section className="bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl shadow-green-100/40 p-6 transition-transform hover:scale-105 hover:shadow-green-200/60">
      <div className="pb-1">
        <div className="flex items-center border-b border-zinc-400/20 pb-3">
          <h2 className="text-xl font-semibold">Due Jobs</h2>
          <Link href="/jobs" className="ml-auto">
            <p className="flex p-3 text-[15px] text-green-700 font-semibold">
              See all <ArrowRightIcon />
            </p>
          </Link>
        </div>
      </div>
      <div>
        {sortedJobs?.map((job) => (
          <div
            key={job.id}
            className="flex items-center border-b border-zinc-400/20"
          >
            <div className="p-4">
              <h3 className="text-sm font-semibold">{job.title}</h3>
              <p className="text-sm flex text-zinc-600">
                <MapPin width={15} height={15} />
                {job.location}
              </p>
              <p className="text-sm text-zinc-600">
                AssignedTo: {job.assignedTo?.name}
              </p>
            </div>
            <div className="flex items-center ml-auto">
              <p className="pl-2 pr-5">
                {getDaysRemaining(job.endDate, job.status)}
              </p>
            </div>
          </div>
        ))}
        {sortedJobs?.length === 0 && (
          <div className="px-4 py-2 text-center text-gray-500">No jobs due</div>
        )}
      </div>
    </section>
  );
}
