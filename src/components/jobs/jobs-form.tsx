"use client";

import React, { useState } from "react";
import { JobFormData } from "@/lib/types";
import { createJob } from "@/actions/index";
import { useRouter } from "next/navigation";
import { useFields } from "@/context/fields-context";
import { useLoadingStore } from "@/lib/stores/loading-store";
import ButtonLoader from "@/components/button-loader";

type JobFormProps = {
  onCancel: () => void;
};

export default function JobForm({ onCancel }: JobFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { users } = useFields();
  const { setCreatingJob } = useLoadingStore();
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    description: "",
    status: "ONGOING",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    location: "",
    assignedToId: "",
  });

  if (!users) return null;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "startDate" || name === "endDate") {
      setFormData({ ...formData, [name]: new Date(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCreatingJob(true);

    try {
      const result = await createJob(formData);
      if (result.success) {
        router.refresh();
        onCancel();
      } else {
        // Handle error
        console.error(result.error);
        alert("Failed to create job. Please try again.");
      }
    } catch (error) {
      console.error("Error creating job:", error);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
      setCreatingJob(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft border border-white/60 p-6 md:p-8">
      <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 mb-6">
        Create New Job
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-neutral-300 rounded-2xl bg-white/80 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-neutral-900 placeholder-neutral-400"
              placeholder="Enter job title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-neutral-300 rounded-2xl bg-white/80 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-neutral-900 placeholder-neutral-400 resize-none"
              placeholder="Enter job description"
            ></textarea>
          </div>
        </div>

        {/* Location and Assignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-neutral-300 rounded-2xl bg-white/80 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-neutral-900 placeholder-neutral-400"
              placeholder="Enter location"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Assigned To
            </label>
            <select
              name="assignedToId"
              value={formData.assignedToId || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-neutral-300 rounded-2xl bg-white/80 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-neutral-900"
            >
              <option value="">Not Assigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dates and Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate.toISOString().split("T")[0]}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-neutral-300 rounded-2xl bg-white/80 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-neutral-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              End Date *
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate.toISOString().split("T")[0]}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-neutral-300 rounded-2xl bg-white/80 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-neutral-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-neutral-300 rounded-2xl bg-white/80 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-neutral-900"
            >
              <option value="ONGOING">Ongoing</option>
              <option value="DUE">Due</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-3 border border-neutral-300 rounded-2xl text-neutral-700 hover:bg-neutral-50 transition-colors font-medium"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <ButtonLoader
            type="submit"
            isLoading={isSubmitting}
            loadingText="Creating..."
            className="w-full sm:w-auto px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-semibold transition-colors shadow-soft hover:shadow-medium disabled:bg-neutral-400 disabled:cursor-not-allowed"
          >
            Create Job
          </ButtonLoader>
        </div>
      </form>
    </div>
  );
}
