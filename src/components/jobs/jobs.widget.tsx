import { useFields } from '@/context/fields-context';
import { JobStatus } from '@prisma/client';
import { ArrowRightIcon, MapPin } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

export default function JobsWidget() {
  const { jobs } = useFields();
  const sortedJobs = jobs?.filter((job) => job.status === 'DUE');

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

  
  return (
    <section className="bg-zinc-100 rounded-lg sm:mt-12 mt-4 shadow-xl ">
      <div className="pl-4 pt-4">
        <div className="flex items-center border-b border-zinc-400/20">
          <h2 className="text-xl font-semibold">Due Jobs</h2>
          <Link href="/jobs" className='ml-auto'><p className=" flex border rounded-md border-zinc-200/20 bg-zinc-200/40 p-1  m-4 text-[15px] text-green-700 font-semibold">See all <ArrowRightIcon /></p></Link>
        </div>
      </div>
      <div>
        {sortedJobs?.map((job) => (
          <div key={job.id} className="flex items-center border-b border-zinc-400/20">
            <div className="p-4">
              <h3 className="text-sm font-semibold">{job.title}</h3>
              <p className="text-sm flex text-zinc-600"><MapPin width={15} height={15}/>{job.location}</p>
              <p className="text-sm text-zinc-600">AssignedTo: {job.assignedTo?.name}</p>
            </div>
            <div className='flex items-center ml-auto'>
              <div className={`h-3 w-3 rounded-full ${
                job.status === 'COMPLETED' ? 'bg-green-500' : 
                job.status === 'DUE' ? 'bg-red-500' : 'bg-blue-500'
              }`}></div>
              <p className='pl-2 pr-5'>{getDaysRemaining(job.endDate,job.status)}</p>
            </div>
            
          </div>
        ))}
      </div>

    </section>
  )
}
