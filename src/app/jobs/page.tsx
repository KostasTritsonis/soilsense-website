'use client';
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import JobsTable from '@/components/jobs/jobs-table';
import JobForm from '@/components/jobs/jobs-form';
export default function Page() {

  const [showJobForm, setShowJobForm] = useState(false);

  return (
    <div className="container flex-row mx-auto px-4 py-8">
      <h1 className="text-2xl text-center font-bold text-gray-800">Agricultural Jobs</h1>
      <div>
        <button 
          onClick={() => setShowJobForm(!showJobForm)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition">
          <PlusCircle className="w-5 h-5" />
          Add New Job
        </button>
        <div className="mt-6">
          {showJobForm && (
            <JobForm  
              onCancel={() => setShowJobForm(false)} 
            />
          )}
          <JobsTable/>
        </div>
      </div>
    </div>
  );
}