"use client";
import React, { useCallback, useMemo } from "react";
import { Calendar, dateFnsLocalizer, View, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { Job } from "@/lib/types";
import "./jobs-calendar.css";

interface CalendarEvent {
  title: string;
  start: Date;
  color: string;
  end: Date;
  resource: Job;
}

interface JobsCalendarProps {
  jobs: Job[];
  onEventSelect?: (event: CalendarEvent) => void;
}

// Constants
const CALENDAR_CONFIG = {
  views: [Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA] as View[],
  step: 60,
  timeslots: 1,
  defaultView: Views.MONTH,
  min: new Date(0, 0, 0, 6, 0, 0),
  max: new Date(0, 0, 0, 22, 0, 0),
};

const JOB_STATUS_COLORS = {
  COMPLETED: "#22c55e",
  DUE: "#ef4444",
  ACTIVE: "#16a34a",
} as const;

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

export default function JobsCalendar({
  jobs,
  onEventSelect,
}: JobsCalendarProps) {
  const [view, setView] = React.useState<View>(Views.MONTH);

  // Memoize events to prevent unnecessary recalculations
  const events: CalendarEvent[] = useMemo(() => {
    return (
      jobs?.map((job) => ({
        title: job.title,
        start: new Date(job.startDate),
        end: job.endDate ? new Date(job.endDate) : new Date(job.startDate),
        color:
          JOB_STATUS_COLORS[job.status as keyof typeof JOB_STATUS_COLORS] ||
          JOB_STATUS_COLORS.ACTIVE,
        resource: job,
      })) || []
    );
  }, [jobs]);

  // Memoize event style getter
  const eventStyleGetter = useCallback((event: CalendarEvent) => {
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
  }, []);

  // Memoize event handlers
  const handleSelectEvent = useCallback(
    (event: CalendarEvent) => {
      onEventSelect?.(event);
    },
    [onEventSelect]
  );

  const handleViewChange = useCallback((newView: View) => {
    setView(newView);
  }, []);

  const tooltipAccessor = useCallback(
    (event: CalendarEvent) => event.title,
    []
  );

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      view={view}
      onView={handleViewChange}
      views={CALENDAR_CONFIG.views}
      className="h-full rbc-calendar"
      onSelectEvent={handleSelectEvent}
      eventPropGetter={eventStyleGetter}
      tooltipAccessor={tooltipAccessor}
      popup
      selectable
      step={CALENDAR_CONFIG.step}
      timeslots={CALENDAR_CONFIG.timeslots}
      defaultView={CALENDAR_CONFIG.defaultView}
      min={CALENDAR_CONFIG.min}
      max={CALENDAR_CONFIG.max}
    />
  );
}
