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
        padding: "6px 10px",
        fontSize: "13px",
        fontWeight: "500",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      },
    };
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="pb-6 md:pb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-neutral-900 pb-2">
              Job Management
            </h1>
            <p className="text-base md:text-lg text-neutral-600">
              Manage your agricultural tasks and schedules
            </p>
          </div>
          <button
            onClick={() => setShowJobForm(!showJobForm)}
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 md:px-6 py-3 rounded-2xl font-semibold transition-colors shadow-soft hover:shadow-medium w-full sm:w-auto"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Add New Job</span>
            <span className="sm:hidden">Add Job</span>
          </button>
        </div>
      </div>

      {!isSignedIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-large border border-white/60 max-w-sm w-full">
            <p className="text-base md:text-lg text-neutral-900 font-semibold text-center">
              Please sign in to access job management
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
          Active Jobs
        </h2>
        <JobsTable />
      </section>

      {/* Calendar Section */}
      <section className="pb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 pb-4 md:pb-6 flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
          Job Calendar
        </h2>
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 overflow-hidden">
          <div className="h-[500px] md:h-[600px] lg:h-[700px] p-4 md:p-6">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={view}
              onView={handleViewChange}
              views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
              className="h-full rbc-calendar"
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter}
              tooltipAccessor={(event: CalendarEvent) => event.title}
              popup
              selectable
              step={60}
              timeslots={1}
              defaultView={Views.MONTH}
              min={new Date(0, 0, 0, 6, 0, 0)}
              max={new Date(0, 0, 0, 22, 0, 0)}
            />
          </div>
        </div>
      </section>

      <style jsx global>{`
        .rbc-calendar {
          font-family: inherit;
          border-radius: 16px;
        }

        .rbc-header {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-bottom: 1px solid #e2e8f0;
          padding: 12px 8px;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .rbc-month-view {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }

        .rbc-month-header {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .rbc-date-cell {
          padding: 8px 4px;
          font-weight: 500;
          color: #374151;
        }

        .rbc-day-bg {
          border: 1px solid #f1f5f9;
          transition: background-color 0.2s ease;
        }

        .rbc-day-bg:hover {
          background-color: #f8fafc;
        }

        .rbc-today {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
        }

        .rbc-off-range-bg {
          background-color: #f8fafc;
        }

        .rbc-off-range {
          color: #9ca3af;
        }

        .rbc-event {
          border-radius: 8px;
          border: none;
          padding: 4px 8px;
          font-size: 12px;
          font-weight: 500;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }

        .rbc-event:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .rbc-toolbar {
          padding: 8px 12px;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-bottom: 1px solid #e2e8f0;
          border-radius: 12px 12px 0 0;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          justify-content: space-between;
          min-height: 40px;
        }
        
        .rbc-toolbar .rbc-btn-group {
          display: flex;
          gap: 4px;
          align-items: center;
        }
        
        .rbc-toolbar .rbc-toolbar-label {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          flex-shrink: 0;
          text-align: center;
          flex: 1;
        }

        .rbc-toolbar button {
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 4px 8px;
          font-weight: 500;
          color: #374151;
          transition: all 0.2s ease;
          font-size: 13px;
          white-space: nowrap;
          flex-shrink: 0;
          min-width: fit-content;
        }

        .rbc-toolbar button:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .rbc-toolbar button.rbc-active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }



        .rbc-time-view {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }

        .rbc-time-header {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .rbc-time-content {
          border-top: 1px solid #e2e8f0;
        }

        .rbc-timeslot-group {
          border-bottom: 1px solid #f1f5f9;
        }

        .rbc-time-slot {
          border-bottom: 1px solid #f8fafc;
        }

        .rbc-agenda-view {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }

        .rbc-agenda-view table.rbc-agenda-table {
          border-radius: 12px;
          overflow: hidden;
        }

        .rbc-agenda-view table.rbc-agenda-table tbody > tr > td {
          padding: 12px 16px;
          border-bottom: 1px solid #f1f5f9;
        }

        .rbc-agenda-view table.rbc-agenda-table .rbc-agenda-time-cell {
          font-weight: 500;
          color: #374151;
        }

        .rbc-agenda-view table.rbc-agenda-table .rbc-agenda-event-cell {
          font-weight: 500;
          color: #111827;
        }

        .rbc-agenda-view table.rbc-agenda-table .rbc-agenda-date-cell {
          font-weight: 600;
          color: #374151;
        }

                @media (max-width: 1024px) {
          .rbc-toolbar {
            gap: 8px;
            padding: 10px 12px;
          }
          
          .rbc-toolbar button {
            padding: 5px 10px;
            font-size: 13px;
          }
          
          .rbc-toolbar .rbc-toolbar-label {
            font-size: 15px;
          }
          
          .rbc-toolbar .rbc-btn-group {
            gap: 3px;
          }
        }
        
        @media (max-width: 768px) {
          .rbc-toolbar {
            flex-direction: row;
            gap: 6px;
            padding: 6px 8px;
            align-items: center;
            min-height: 32px;
          }
          
          .rbc-toolbar .rbc-toolbar-label {
            font-size: 13px;
            text-align: center;
            flex: 1;
          }
          
          .rbc-toolbar .rbc-btn-group {
            display: flex;
            gap: 4px;
            justify-content: center;
          }
          
          .rbc-toolbar button {
            padding: 4px 6px;
            font-size: 11px;
            min-width: auto;
            justify-content: center;
            border-radius: 4px;
          }
        }
        
        /* Minimal but functional toolbar on very small screens */
        @media (max-width: 480px) {
          .rbc-toolbar {
            padding: 4px 6px;
            min-height: 28px;
            gap: 4px;
          }
          
          .rbc-toolbar .rbc-toolbar-label {
            font-size: 12px;
          }
          
          .rbc-toolbar button {
            padding: 3px 5px;
            font-size: 10px;
            border-radius: 3px;
          }
          
          /* Hide view buttons on very small screens to save space */
          .rbc-toolbar .rbc-btn-group:last-child {
            display: none;
          }
        }

          .rbc-header {
            padding: 8px 4px;
            font-size: 12px;
          }

          .rbc-date-cell {
            padding: 6px 2px;
            font-size: 12px;
          }

          .rbc-event {
            font-size: 11px;
            padding: 2px 6px;
          }
        }
      `}</style>
    </div>
  );
}
