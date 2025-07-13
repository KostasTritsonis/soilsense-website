"use client";
import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import JobsTable from "@/components/jobs/jobs-table";
import JobForm from "@/components/jobs/jobs-form";
import { useUser } from "@clerk/nextjs";
import { Calendar, dateFnsLocalizer, View, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { useFields } from "@/context/fields-context";
import { Job } from "@/lib/types";

// Define type for calendar event
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

  // Ensure jobs exist and handle potential null/undefined endDate values
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
      resource: job, // This allows accessing the full job data in event handlers
    })) || [];

  const handleSelectEvent = (event: CalendarEvent) => {
    // You can handle event clicks here, e.g., show job details in a modal
    console.log("Selected job:", event.resource);
  };

  // Define custom handler for view changes
  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  // Define a custom event style getter to color events based on job properties
  const eventStyleGetter = (event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: event.color,
        color: "white",
        borderRadius: "4px",
        border: "none",
        padding: "2px 5px",
      },
    };
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col max-sm:pb-[60px]">
      <h1 className="text-2xl text-center font-bold text-gray-800">
        Agricultural Jobs
      </h1>

      {!isSignedIn && (
        <div className="absolute z-50 inset-0 flex items-center justify-center bg-black/70">
          <p className="text-lg text-white font-semibold">
            Please sign in to access the jobs
          </p>
        </div>
      )}

      <div className="mt-4 flex flex-col sm:flex-row sm:justify-between items-start">
        <button
          onClick={() => setShowJobForm(!showJobForm)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white md:text-[14px] text-[12px] px-4 py-2 rounded-md transition w-auto"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Job
        </button>
      </div>

      <div className="mt-6 w-full">
        {showJobForm && <JobForm onCancel={() => setShowJobForm(false)} />}
        <div className="overflow-x-auto">
          <JobsTable />
        </div>
      </div>

      <div className="mt-8 w-full">
        <h2 className="text-lg font-semibold mb-2">Job Calendar</h2>
        <div className="w-full overflow-hidden">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={handleViewChange}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            style={{ height: 500 }}
            className="border rounded-lg shadow-md"
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            tooltipAccessor={(event: CalendarEvent) => event.title}
          />
        </div>
      </div>
    </div>
  );
}
