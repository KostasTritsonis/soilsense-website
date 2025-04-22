'use client';
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import JobsTable from '@/components/jobs/jobs-table';
import JobForm from '@/components/jobs/jobs-form';
import { useUser } from '@clerk/nextjs';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { useFields } from '@/context/fields-context';

export default function Page() {
  const [showJobForm, setShowJobForm] = useState(false);
  const {jobs} = useFields();
  const { isSignedIn } = useUser();
  const [view, setView] = useState(Views.MONTH);

  const locales = {
    'en-US': require('date-fns/locale/en-US'),
  };
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
  });


  const events = jobs?.map(job => ({
    title: job.title,
    start: new Date(job.startDate),
    end: new Date(job.endDate), // Set the end date same as start for single-day jobs
  }))

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col max-sm:pb-[60px]">
      <h1 className="text-2xl text-center font-bold text-gray-800">Agricultural Jobs</h1>

      {!isSignedIn && (
        <div className="absolute z-50 inset-0 flex items-center justify-center bg-black/70">
          <p className="text-lg text-white font-semibold">Please sign in to access the map</p>
        </div>
      )}

      <div className="mt-4 lg:w-[50%] w-[35%] flex flex-col sm:flex-row sm:justify-between items-center">
        <button
          onClick={() => setShowJobForm(!showJobForm)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white md:text-[14px] text-[12px] px-4 py-2 rounded-md transition w-full sm:w-auto">
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
            defaultView={view}
            views={['month', 'week', 'day', 'agenda']}
            style={{ height: 500 }}
            className="border rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
