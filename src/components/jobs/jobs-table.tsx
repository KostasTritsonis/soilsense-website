'use client';
import React from 'react';
import { JobStatus } from '@/lib/types';
import StatusBadge from './status-badge';
import { deleteJob, updateJobStatus } from '@/actions/index';
import { useRouter } from 'next/navigation';
import { useFields } from '@/context/fields-context';

const header = [
  {
    label: 'Job',
  },
  {
    label: 'Timeline',
  },
  {
    label: 'Status',
  },
  {
    label: 'Location',
  },
  {
    label: 'Assigned to',
  },
  {
    label: 'Actions',
  },
  {
    label: 'Delete',
  }

]

export default function JobsTable() {
  const router = useRouter();
  const {jobs} = useFields();
  if (!jobs) return null

  // Calculate days remaining or overdue
  const getDaysRemaining = (endDate: Date,status: JobStatus) => {
    const today = new Date();
    const diffTime = new Date(endDate).getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      if(status === 'COMPLETED') return 'Completed';
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return "Due today";
    } else {
      return `${diffDays} days remaining`;
    }
  };

  // Handle status change
  const handleStatusChange = async (id: string, newStatus: string) => {
    const result = await updateJobStatus(id, newStatus as JobStatus);
    if (result.success) {
      setTimeout(() => router.refresh(), 300);
    } else {
      alert('Failed to update job status');
    }
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
   const result = await deleteJob(id);
   if (result.success) {
    setTimeout(() => router.refresh(), 100);
   } else {
    alert('Failed to delete job');
   }
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        No jobs found. Create your first job to get started.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden text-center">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {header.map((header) => (
                <th key={header.label} className="py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50 ">
                <td className="py-4">
                  <div className="text-sm font-medium text-gray-900">{job.title}</div>
                  <div className="text-sm text-gray-500">{job.description}</div>
                </td>
                <td className="py-4">
                  <div className="text-sm text-gray-900">
                    {new Date(job.startDate).toLocaleDateString()} to {new Date(job.endDate).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {getDaysRemaining(job.endDate,job.status)}
                  </div>
                  <div className="mx-auto mt-2 w-1/2 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        job.status === 'COMPLETED' ? 'bg-green-500' : 
                        job.status === 'DUE' ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                      style={{ 
                        width: `${calculateProgress(job.startDate, job.endDate)}%` 
                      }}
                    ></div>
                  </div>
                </td>
                <td className="py-4">
                  <StatusBadge status={job.status} />
                </td>
                <td className="py-4 text-sm text-gray-500">
                  {job.location || 'Not specified'}
                </td>
                <td className="py-4 text-sm text-gray-500">
                  {job.assignedTo?.name || 'Unassigned'}
                </td>
                <td className="py-4  text-sm font-medium">
                  <select 
                    value={job.status}
                    onChange={(e) => handleStatusChange(job.id, e.target.value)}
                    className="text-sm border text-center border-gray-300 rounded px-2 py-1"
                  >
                    <option value="ONGOING">Ongoing</option>
                    <option value="DUE">Due</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </td>
                <td className='pr-2 py-4'>
                  <button onClick={() => handleDelete(job.id)}>❌</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}