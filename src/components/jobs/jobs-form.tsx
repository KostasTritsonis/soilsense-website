"use client";

import React, { useState } from "react";
import { JobFormData } from "@/lib/types";
import { createJob } from "@/actions/index";
import { useRouter } from "next/navigation";
import { useJobsStore } from "@/lib/stores/jobs-store";
import { useLoadingStore } from "@/lib/stores/loading-store";
import ButtonLoader from "@/components/button-loader";
import { useTranslations } from "next-intl";

type JobFormProps = {
  onCancel: () => void;
};

export default function JobForm({ onCancel }: JobFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { users } = useJobsStore();
  const { setCreatingJob } = useLoadingStore();
  const t = useTranslations();
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
        alert(t("jobs.failedToCreateJob"));
      }
    } catch (error) {
      console.error("Error creating job:", error);
      alert(t("jobs.unexpectedError"));
    } finally {
      setIsSubmitting(false);
      setCreatingJob(false);
    }
  };

  return (
    <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-4 md:p-5 lg:p-6 xl:p-8">
      <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 md:mb-5 lg:mb-6">
        {t("jobs.jobFormTitle")}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 md:space-y-5 lg:space-y-6"
      >
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              {t("jobs.jobTitle")} *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl md:rounded-2xl bg-white/80 dark:bg-neutral-700/80 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 text-sm md:text-base"
              placeholder={t("jobs.jobTitle")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              {t("jobs.jobDescription")}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl md:rounded-2xl bg-white/80 dark:bg-neutral-700/80 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 resize-none text-sm md:text-base"
              placeholder={t("jobs.jobDescription")}
            ></textarea>
          </div>
        </div>

        {/* Location and Assignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              {t("jobs.jobLocation")}
            </label>
            <input
              type="text"
              name="location"
              value={formData.location || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl md:rounded-2xl bg-white/80 dark:bg-neutral-700/80 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 text-sm md:text-base"
              placeholder={t("jobs.jobLocation")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              {t("jobs.jobAssignedTo")}
            </label>
            <select
              name="assignedToId"
              value={formData.assignedToId || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl md:rounded-2xl bg-white/80 dark:bg-neutral-700/80 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 text-neutral-900 dark:text-neutral-100 text-sm md:text-base"
            >
              <option value="">{t("jobs.selectUser")}</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dates and Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              {t("jobs.jobStartDate")} *
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate.toISOString().split("T")[0]}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl md:rounded-2xl bg-white/80 dark:bg-neutral-700/80 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 text-neutral-900 dark:text-neutral-100 text-sm md:text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              {t("jobs.jobEndDate")} *
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate.toISOString().split("T")[0]}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl md:rounded-2xl bg-white/80 dark:bg-neutral-700/80 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 text-neutral-900 dark:text-neutral-100 text-sm md:text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              {t("jobs.jobStatus")}
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl md:rounded-2xl bg-white/80 dark:bg-neutral-700/80 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 text-neutral-900 dark:text-neutral-100 text-sm md:text-base"
            >
              <option value="ONGOING">{t("jobs.ongoing")}</option>
              <option value="DUE">{t("jobs.due")}</option>
              <option value="COMPLETED">{t("jobs.completed")}</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-4 md:px-5 lg:px-6 h-10 md:h-11 flex items-center justify-center border border-neutral-300 dark:border-neutral-600 rounded-lg md:rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors font-medium text-sm md:text-base"
            disabled={isSubmitting}
          >
            {t("common.cancel")}
          </button>
          <ButtonLoader
            type="submit"
            isLoading={isSubmitting}
            loadingText={t("common.creating")}
            className="w-full sm:w-auto px-4 md:px-5 lg:px-6 h-10 md:h-11 bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 text-white rounded-lg md:rounded-xl font-semibold transition-colors shadow-soft hover:shadow-medium disabled:bg-neutral-400 dark:disabled:bg-neutral-600 disabled:cursor-not-allowed text-sm md:text-base"
          >
            {t("jobs.createJob")}
          </ButtonLoader>
        </div>
      </form>
    </div>
  );
}
