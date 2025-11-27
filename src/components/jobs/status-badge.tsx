import React from "react";
import { Check, AccessTime, Error } from "@mui/icons-material";
import { JobStatus } from "@/lib/types";

type StatusBadgeProps = {
  status: JobStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  // Function to get status badge color
  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      case "DUE":
        return "bg-red-100 text-red-800 border-red-200";
      case "ONGOING":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-neutral-100 text-neutral-800 border-neutral-200";
    }
  };

  // Function to get status icon
  const getStatusIcon = (status: JobStatus) => {
    switch (status) {
      case "COMPLETED":
        return <Check fontSize="small" />;
      case "DUE":
        return <Error fontSize="small" />;
      case "ONGOING":
        return <AccessTime fontSize="small" />;
      default:
        return null;
    }
  };

  // Format status display text
  const formatStatus = (status: JobStatus) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
        status
      )}`}
    >
      {getStatusIcon(status)}
      <span>{formatStatus(status)}</span>
    </span>
  );
}
