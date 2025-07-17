"use client";
import React, { useState } from "react";
import { PlusCircle, Calendar as CalendarIcon } from "lucide-react";
import JobsTable from "@/components/jobs/jobs-table";
import JobForm from "@/components/jobs/jobs-form";
import { useUser } from "@clerk/nextjs";
import { Calendar, dateFnsLocalizer, View, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { useFields } from "@/context/fields-context";
import { Job } from "@/lib/types";

interface CalendarEvent {
  title: string;
  start: Date;
  color: string;
  end: Date;
  resource: Job;
}

export default function Page() {
  const [showJobForm, setShowJobForm] = useState(false);
  const { jobs } = useFields();
  const { isSignedIn } = useUser();
  const [view, setView] = useState<View>(Views.MONTH);

  const locales = {
    "en-US": enUS,
  };

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  const events: CalendarEvent[] =
    jobs?.map((job) => ({
      title: job.title,
      start: new Date(job.startDate),
      end: job.endDate ? new Date(job.endDate) : new Date(job.startDate),
      color:
        job.status === "COMPLETED"
          ? "#22c55e"
          : job.status === "DUE"
          ? "#ef4444"
          : "#3b82f6",
      resource: job,
    })) || [];

  const handleSelectEvent = (event: CalendarEvent) => {
    console.log("Selected job:", event.resource);
  };

  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: event.color,
        color: "white",
        borderRadius: "8px",
        border: "none",
        padding: "4px 8px",
        fontSize: "12px",
      },
    };
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="pb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-neutral-900 pb-2">
              Job Management
            </h1>
            <p className="text-lg text-neutral-600">
              Manage your agricultural tasks and schedules
            </p>
          </div>
          <button
            onClick={() => setShowJobForm(!showJobForm)}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-2xl font-semibold transition-colors shadow-soft hover:shadow-medium"
          >
            <PlusCircle className="w-5 h-5" />
            Add New Job
          </button>
        </div>
      </div>

      {!isSignedIn && (
        <div className="absolute z-50 inset-0 flex items-center justify-center bg-black/70">
          <div className="bg-white rounded-3xl p-8 shadow-large">
            <p className="text-lg text-neutral-900 font-semibold">
              Please sign in to access job management
            </p>
          </div>
        </div>
      )}

      {/* Job Form */}
      {showJobForm && (
        <div className="pb-8">
          <JobForm onCancel={() => setShowJobForm(false)} />
        </div>
      )}

      {/* Jobs Table */}
      <section className="pb-8">
        <h2 className="text-2xl font-semibold text-neutral-900 pb-6">
          Active Jobs
        </h2>
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 overflow-hidden">
          <JobsTable />
        </div>
      </section>

      {/* Calendar Section */}
      <section>
        <h2 className="text-2xl font-semibold text-neutral-900 pb-6 flex items-center gap-3">
          <CalendarIcon className="w-6 h-6 text-primary-600" />
          Job Calendar
        </h2>
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 overflow-hidden">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={handleViewChange}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            style={{ height: 500 }}
            className="border-0"
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            tooltipAccessor={(event: CalendarEvent) => event.title}
          />
        </div>
      </section>
    </div>
  );
}
