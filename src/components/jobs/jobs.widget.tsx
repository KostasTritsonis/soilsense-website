import { useFields } from '@/context/fields-context';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

export default function JobsWidget() {
  const { jobs } = useFields();

  return (
    <div className="bg-zinc-100 rounded-lg mt-12 shadow-xl overflow-hidden">
      <div className="pl-4 py-4">
        <div className="flex items-center border-b border-zinc-400/20">
          <h2 className="text-xl font-semibold">Recent Jobs</h2>
          <Link href="/weather" className='ml-auto'><p className=" flex border rounded-md border-zinc-200/20 bg-zinc-200/40 p-1  m-4 text-[15px] text-green-700 font-semibold">See all <ArrowRightIcon /></p></Link>
        </div>
      </div>
    </div>
  )
}
