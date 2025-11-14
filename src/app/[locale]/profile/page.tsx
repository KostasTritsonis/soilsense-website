"use client";
import { useUser } from "@clerk/nextjs";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import {
  User,
  Mail,
  Calendar,
  Settings,
  LogOut,
  MapPin,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useFieldsStore } from "@/lib/stores/fields-store";
import { useJobsStore } from "@/lib/stores/jobs-store";
import { useLocale } from "next-intl";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { fields, fetchFields } = useFieldsStore();
  const { jobs, fetchJobs } = useJobsStore();
  const locale = useLocale();

  useEffect(() => {
    if (user) {
      fetchFields();
      fetchJobs();
    }
  }, [user, fetchFields, fetchJobs]);

  // Calculate statistics
  const totalFields = fields.length;
  const completedJobs =
    jobs?.filter((job) => job.status === "COMPLETED").length || 0;
  const totalArea = fields.reduce((sum, field) => sum + (field.area || 0), 0);

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="pb-4 md:pb-8">
        <h1 className="text-xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Profile
        </h1>
        <p className="text-sm md:text-lg text-neutral-600 dark:text-neutral-400">
          Manage your account settings and preferences
        </p>
      </div>

      <SignedIn>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-4 md:p-6 h-full flex flex-col">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-6 mb-4 md:mb-8">
                <div className="w-12 h-12 sm:w-20 sm:h-20 bg-primary-100 dark:bg-primary-900/30 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 sm:w-10 sm:h-10 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-lg sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                    {user?.fullName || "User"}
                  </h2>
                  <p className="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 break-all">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
                <div className="flex flex-row gap-2 sm:gap-3">
                  <Link
                    href={`/${locale}/profile/edit`}
                    className="flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg md:rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors text-xs md:text-sm"
                  >
                    <Settings className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span className="sm:hidden inline">Edit</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg md:rounded-xl hover:bg-red-700 dark:hover:bg-red-600 transition-colors text-xs md:text-sm"
                  >
                    <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span className="sm:hidden inline">Sign Out</span>
                  </button>
                </div>
              </div>

              {/* Profile Information */}
              <div className="space-y-3 md:space-y-6 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                  <div className="flex items-start gap-2 md:gap-3 p-2.5 md:p-4 bg-neutral-50 dark:bg-neutral-700/80 rounded-lg md:rounded-xl">
                    <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Email
                      </p>
                      <p className="font-medium text-neutral-900 dark:text-neutral-100 text-xs md:text-base break-all">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 md:gap-3 p-2.5 md:p-4 bg-neutral-50 dark:bg-neutral-700/80 rounded-lg md:rounded-xl">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Member Since
                      </p>
                      <p className="font-medium text-neutral-900 dark:text-neutral-100 text-xs md:text-base">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <h3 className="text-sm md:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2 md:mb-4">
                    Recent Fields
                  </h3>
                  <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
                    {fields.slice(0, 3).map((field) => (
                      <div
                        key={field.id}
                        className="flex items-center gap-2 md:gap-3 p-1.5 md:p-2 bg-neutral-50 dark:bg-neutral-700/80 rounded-lg"
                      >
                        <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs md:text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                            {field.label || "Unnamed Field"}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {(field.area || 0).toFixed(2)} m²
                          </p>
                        </div>
                      </div>
                    ))}
                    {fields.length === 0 && (
                      <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 text-center py-3 md:py-4">
                        No fields created yet
                      </p>
                    )}
                  </div>
                  {fields.length > 3 && (
                    <Link
                      href={`/${locale}/fields`}
                      className="block text-center text-xs md:text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-3 md:mb-4"
                    >
                      View all fields
                    </Link>
                  )}
                </div>

                {/* Recent Jobs */}
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <h3 className="text-sm md:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2 md:mb-4">
                    Recent Jobs
                  </h3>
                  <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
                    {jobs?.slice(0, 3).map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center gap-2 md:gap-3 p-1.5 md:p-2 bg-neutral-50 dark:bg-neutral-700/80 rounded-lg"
                      >
                        <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs md:text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                            {job.title}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {job.status} •{" "}
                            {new Date(job.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {(!jobs || jobs.length === 0) && (
                      <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 text-center py-3 md:py-4">
                        No jobs created yet
                      </p>
                    )}
                  </div>
                  {jobs && jobs.length > 3 && (
                    <Link
                      href={`/${locale}/jobs`}
                      className="block text-center text-xs md:text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-3 md:mb-4"
                    >
                      View all jobs
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-3 md:space-y-6 flex flex-col h-full">
            {/* Quick Stats */}
            <div className="bg-white/80 dark:bg-neutral-800/90 backdrop-blur-md rounded-2xl md:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-3 md:p-6 flex-1">
              <h3 className="text-sm md:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2 md:mb-4">
                Quick Stats
              </h3>
              <div className="space-y-2 md:space-y-4">
                <div className="flex justify-between items-center py-1.5 md:py-2">
                  <span className="text-xs md:text-base text-neutral-600 dark:text-neutral-400">
                    Fields Created
                  </span>
                  <span className="font-semibold text-primary-600 dark:text-primary-400 text-xs md:text-base">
                    {totalFields}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 md:py-2">
                  <span className="text-xs md:text-base text-neutral-600 dark:text-neutral-400">
                    Total Area
                  </span>
                  <span className="font-semibold text-primary-600 dark:text-primary-400 text-xs md:text-base">
                    {totalArea.toFixed(2)} m²
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 md:py-2">
                  <span className="text-xs md:text-base text-neutral-600 dark:text-neutral-400">
                    Jobs Completed
                  </span>
                  <span className="font-semibold text-primary-600 dark:text-primary-400 text-xs md:text-base">
                    {completedJobs}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 md:py-2">
                  <span className="text-xs md:text-base text-neutral-600 dark:text-neutral-400">
                    Active Jobs
                  </span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs md:text-base">
                    {jobs?.filter((job) => job.status === "ONGOING").length ||
                      0}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 md:py-2">
                  <span className="text-xs md:text-base text-neutral-600 dark:text-neutral-400">
                    Account Status
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400 text-xs md:text-base">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white/80 dark:bg-neutral-800/90 backdrop-blur-md rounded-2xl md:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-3 md:p-6 flex-1">
              <h3 className="text-sm md:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2 md:mb-4">
                Preferences
              </h3>
              <div className="space-y-2 md:space-y-3">
                <label className="flex items-center gap-2 md:gap-3 py-1.5 md:py-2">
                  <input
                    type="checkbox"
                    className="rounded w-3.5 h-3.5 md:w-4 md:h-4 text-primary-600 dark:text-primary-400 bg-white dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 focus:ring-primary-500 dark:focus:ring-primary-400"
                    defaultChecked
                  />
                  <span className="text-xs md:text-base text-neutral-700 dark:text-neutral-300">
                    Email notifications
                  </span>
                </label>
                <label className="flex items-center gap-2 md:gap-3 py-1.5 md:py-2">
                  <input
                    type="checkbox"
                    className="rounded w-3.5 h-3.5 md:w-4 md:h-4 text-primary-600 dark:text-primary-400 bg-white dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 focus:ring-primary-500 dark:focus:ring-primary-400"
                    defaultChecked
                  />
                  <span className="text-xs md:text-base text-neutral-700 dark:text-neutral-300">
                    Weather alerts
                  </span>
                </label>
                <label className="flex items-center gap-2 md:gap-3 py-1.5 md:py-2">
                  <input
                    type="checkbox"
                    className="rounded w-3.5 h-3.5 md:w-4 md:h-4 text-primary-600 dark:text-primary-400 bg-white dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 focus:ring-primary-500 dark:focus:ring-primary-400"
                  />
                  <span className="text-xs md:text-base text-neutral-700 dark:text-neutral-300">
                    Job reminders
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="bg-white/80 dark:bg-neutral-800/90 backdrop-blur-md rounded-2xl md:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-4 md:p-8 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3 md:mb-4">
            Sign In Required
          </h2>
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 mb-4 md:mb-6">
            Please sign in to view your profile and manage your account
            settings.
          </p>
          <Link
            href={`/${locale}/sign-in`}
            className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-lg md:rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors text-sm md:text-base"
          >
            Sign In
          </Link>
        </div>
      </SignedOut>
    </div>
  );
}
