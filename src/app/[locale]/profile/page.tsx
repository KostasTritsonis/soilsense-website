"use client";
import { useUser } from "@clerk/nextjs";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import {
  Person,
  Mail,
  CalendarToday,
  Settings,
  Logout,
  LocationOn,
  CheckCircle,
} from "@mui/icons-material";
import Link from "next/link";
import { useFieldsStore } from "@/lib/stores/fields-store";
import { useJobsStore } from "@/lib/stores/jobs-store";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import ThemeToggle from "@/components/theme-toggle";
import LanguageSwitcher from "@/components/language-switcher";

export default function ProfilePage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { fields, fetchFields } = useFieldsStore();
  const { jobs, fetchJobs } = useJobsStore();
  const locale = useLocale();
  const t = useTranslations();

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
    <div className="w-full min-w-0 h-full flex flex-col overflow-x-hidden">
      {/* Header */}
      <div className="pb-4 md:pb-6 lg:pb-8 flex-shrink-0 min-w-0">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-neutral-100 break-words">
          Profile
        </h1>
        <p className="text-sm md:text-base lg:text-lg text-neutral-600 dark:text-neutral-400 break-words">
          Manage your account settings and preferences
        </p>
      </div>

      <SignedIn>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-8 flex-1 min-h-0">
          {/* Profile Card */}
          <div className="lg:col-span-2 flex flex-col min-h-0">
            <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-4 md:p-6 h-full flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 md:mb-8 flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Person
                    className="text-primary-600 dark:text-primary-400"
                    sx={{ fontSize: { xs: "2rem", sm: "2.5rem" } }}
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                    {user?.fullName || "User"}
                  </h2>
                  <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 break-all">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
                <div className="flex flex-row gap-2 sm:gap-3">
                  <Link
                    href={`/${locale}/profile/edit`}
                    className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg md:rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors text-sm"
                  >
                    <Settings fontSize="small" />
                    <span className="sm:hidden inline">Edit</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg md:rounded-xl hover:bg-red-700 dark:hover:bg-red-600 transition-colors text-sm"
                  >
                    <Logout fontSize="small" />
                    <span className="sm:hidden inline">Sign Out</span>
                  </button>
                </div>
              </div>

              {/* Profile Information */}
              <div className="space-y-4 md:space-y-6 flex-1 overflow-y-auto min-h-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="flex items-start gap-3 p-4 bg-neutral-50 dark:bg-neutral-700/80 rounded-xl">
                    <Mail
                      className="text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5"
                      fontSize="small"
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Email
                      </p>
                      <p className="font-medium text-neutral-900 dark:text-neutral-100 text-sm md:text-base break-all">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-neutral-50 dark:bg-neutral-700/80 rounded-xl">
                    <CalendarToday
                      className="text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5"
                      fontSize="small"
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Member Since
                      </p>
                      <p className="font-medium text-neutral-900 dark:text-neutral-100 text-sm md:text-base">
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
                  <h3 className="text-base md:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3 md:mb-4">
                    Recent Fields
                  </h3>
                  <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
                    {fields.slice(0, 3).map((field) => (
                      <div
                        key={field.id}
                        className="flex items-center gap-3 p-2 bg-neutral-50 dark:bg-neutral-700/80 rounded-lg"
                      >
                        <LocationOn
                          className="text-primary-600 dark:text-primary-400 flex-shrink-0"
                          fontSize="small"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                            {field.label || "Unnamed Field"}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {(field.area || 0).toFixed(2)} m²
                          </p>
                        </div>
                      </div>
                    ))}
                    {fields.length === 0 && (
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-4">
                        No fields created yet
                      </p>
                    )}
                  </div>
                  {fields.length > 3 && (
                    <Link
                      href={`/${locale}/fields`}
                      className="block text-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-4"
                    >
                      View all fields
                    </Link>
                  )}
                </div>

                {/* Recent Jobs */}
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <h3 className="text-base md:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3 md:mb-4">
                    Recent Jobs
                  </h3>
                  <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
                    {jobs?.slice(0, 3).map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center gap-3 p-2 bg-neutral-50 dark:bg-neutral-700/80 rounded-lg"
                      >
                        <CheckCircle
                          className="text-blue-600 dark:text-blue-400 flex-shrink-0"
                          fontSize="small"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
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
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-4">
                        No jobs created yet
                      </p>
                    )}
                  </div>
                  {jobs && jobs.length > 3 && (
                    <Link
                      href={`/${locale}/jobs`}
                      className="block text-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-4"
                    >
                      View all jobs
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-3 md:space-y-6 flex flex-col min-h-0">
            {/* Quick Stats */}
            <div className="bg-white/80 dark:bg-neutral-800/90 backdrop-blur-md rounded-2xl md:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-4 md:p-6 flex-1">
              <h3 className="text-base md:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3 md:mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">
                    Fields Created
                  </span>
                  <span className="font-semibold text-primary-600 dark:text-primary-400 text-sm md:text-base">
                    {totalFields}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">
                    Total Area
                  </span>
                  <span className="font-semibold text-primary-600 dark:text-primary-400 text-sm md:text-base">
                    {totalArea.toFixed(2)} m²
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">
                    Jobs Completed
                  </span>
                  <span className="font-semibold text-primary-600 dark:text-primary-400 text-sm md:text-base">
                    {completedJobs}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">
                    Active Jobs
                  </span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400 text-sm md:text-base">
                    {jobs?.filter((job) => job.status === "ONGOING").length ||
                      0}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">
                    Account Status
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400 text-sm md:text-base">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white/80 dark:bg-neutral-800/90 backdrop-blur-md rounded-2xl md:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-4 md:p-6 flex-1">
              <h3 className="text-base md:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3 md:mb-4">
                Preferences
              </h3>

              {/* Mobile-only Theme and Language Settings */}
              <div className="md:hidden space-y-3 mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    {t("theme.theme")}
                  </h4>
                  <div className="[&>div]:p-0.5 [&>div]:rounded-lg [&>div>button]:p-1.5 [&>div>button]:text-xs [&>div>button>svg]:w-3.5 [&>div>button>svg]:h-3.5">
                    <ThemeToggle />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    {t("common.language")}
                  </h4>
                  <div className="[&>div]:p-0.5 [&>div]:rounded-lg [&>div>button]:px-2 [&>div>button]:py-1.5 [&>div>button]:text-xs [&>div>button>span:first-child]:text-sm">
                    <LanguageSwitcher />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    className="rounded w-4 h-4 text-primary-600 dark:text-primary-400 bg-white dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 focus:ring-primary-500 dark:focus:ring-primary-400"
                    defaultChecked
                  />
                  <span className="text-sm md:text-base text-neutral-700 dark:text-neutral-300">
                    Email notifications
                  </span>
                </label>
                <label className="flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    className="rounded w-4 h-4 text-primary-600 dark:text-primary-400 bg-white dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 focus:ring-primary-500 dark:focus:ring-primary-400"
                    defaultChecked
                  />
                  <span className="text-sm md:text-base text-neutral-700 dark:text-neutral-300">
                    Weather alerts
                  </span>
                </label>
                <label className="flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    className="rounded w-4 h-4 text-primary-600 dark:text-primary-400 bg-white dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 focus:ring-primary-500 dark:focus:ring-primary-400"
                  />
                  <span className="text-sm md:text-base text-neutral-700 dark:text-neutral-300">
                    Job reminders
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="bg-white/80 dark:bg-neutral-800/90 backdrop-blur-md rounded-2xl md:rounded-3xl shadow-soft border border-white/60 dark:border-neutral-700/60 p-6 md:p-8 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Sign In Required
          </h2>
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 mb-6">
            Please sign in to view your profile and manage your account
            settings.
          </p>
          <Link
            href={`/${locale}/sign-in`}
            className="inline-flex items-center gap-2 px-5 md:px-6 py-2 md:py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-lg md:rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors text-sm md:text-base"
          >
            Sign In
          </Link>
        </div>
      </SignedOut>
    </div>
  );
}
