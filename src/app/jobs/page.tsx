'use client';
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import JobsTable from '@/components/jobs/jobs-table';
import JobForm from '@/components/jobs/jobs-form';
import { useUser } from '@clerk/nextjs';
export default function Page() {

  const [showJobForm, setShowJobForm] = useState(false);
  const  { isSignedIn } =  useUser();
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col max-sm:pb-[60px]">
      <h1 className="text-2xl text-center font-bold text-gray-800">Agricultural Jobs</h1>

      {(!isSignedIn) && (
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
        {showJobForm && (
          <JobForm onCancel={() => setShowJobForm(false)} />
        )}
        <div className="overflow-x-auto">
          <JobsTable />
        </div>
      </div>
    </div>
  );
}