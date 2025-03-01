import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { JobStatus } from '@/lib/types';

type StatusBadgeProps = {
  status: JobStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  // Function to get status badge color
  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'DUE': return 'bg-red-100 text-red-800';
      case 'ONGOING': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get status icon
  const getStatusIcon = (status: JobStatus) => {
    switch (status) {
      case 'COMPLETED': return <Check className="w-4 h-4" />;
      case 'DUE': return <AlertCircle className="w-4 h-4" />;
      case 'ONGOING': return <Clock className="w-4 h-4" />;
      default: return null;
    }
  };

  // Format status display text 
  const formatStatus = (status: JobStatus) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {getStatusIcon(status)}
      <span className="ml-1">{formatStatus(status)}</span>
    </span>
  );
}
