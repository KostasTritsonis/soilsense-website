"use client";
import { useUser } from "@clerk/nextjs";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { User, Mail, Calendar, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useUser();

  return (
    <div className="h-auto bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-100">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
              Profile
            </h1>
            <p className="text-sm md:text-base text-neutral-600">
              Manage your account settings and preferences
            </p>
          </div>

          <SignedIn>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Profile Card */}
              <div className="lg:col-span-2">
                <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-soft border border-white/60 p-4 md:p-6 lg:p-8 h-full flex flex-col">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 md:mb-8">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <User className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600" />
                    </div>
                    <div className="text-center sm:text-left">
                      <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-1">
                        {user?.fullName || "User"}
                      </h2>
                      <p className="text-sm sm:text-base text-neutral-600 break-all">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>

                  {/* Profile Information */}
                  <div className="space-y-4 md:space-y-6 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="flex items-start gap-3 p-3 md:p-4 bg-neutral-50 rounded-xl">
                        <Mail className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="text-xs md:text-sm text-neutral-500">
                            Email
                          </p>
                          <p className="font-medium text-neutral-900 text-sm md:text-base break-all">
                            {user?.primaryEmailAddress?.emailAddress}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 md:p-4 bg-neutral-50 rounded-xl">
                        <Calendar className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="text-xs md:text-sm text-neutral-500">
                            Member Since
                          </p>
                          <p className="font-medium text-neutral-900 text-sm md:text-base">
                            {user?.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Account Actions */}
                    <div className="pt-4 md:pt-6 border-t border-neutral-200">
                      <h3 className="text-base md:text-lg font-semibold text-neutral-900 mb-3 md:mb-4">
                        Account Actions
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          href="/profile/edit"
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm md:text-base"
                        >
                          <Settings className="w-4 h-4" />
                          Edit Profile
                        </Link>
                        <button className="flex items-center justify-center gap-2 px-4 py-3 bg-neutral-100 text-neutral-700 rounded-xl hover:bg-neutral-200 transition-colors text-sm md:text-base">
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4 md:space-y-6 flex flex-col h-full">
                {/* Quick Stats */}
                <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-soft border border-white/60 p-4 md:p-6 flex-1">
                  <h3 className="text-base md:text-lg font-semibold text-neutral-900 mb-3 md:mb-4">
                    Quick Stats
                  </h3>
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm md:text-base text-neutral-600">
                        Fields Created
                      </span>
                      <span className="font-semibold text-primary-600 text-sm md:text-base">
                        0
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm md:text-base text-neutral-600">
                        Jobs Completed
                      </span>
                      <span className="font-semibold text-primary-600 text-sm md:text-base">
                        0
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm md:text-base text-neutral-600">
                        Account Status
                      </span>
                      <span className="font-semibold text-green-600 text-sm md:text-base">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-soft border border-white/60 p-4 md:p-6 flex-1">
                  <h3 className="text-base md:text-lg font-semibold text-neutral-900 mb-3 md:mb-4">
                    Preferences
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 py-2">
                      <input
                        type="checkbox"
                        className="rounded w-4 h-4"
                        defaultChecked
                      />
                      <span className="text-sm md:text-base text-neutral-700">
                        Email notifications
                      </span>
                    </label>
                    <label className="flex items-center gap-3 py-2">
                      <input
                        type="checkbox"
                        className="rounded w-4 h-4"
                        defaultChecked
                      />
                      <span className="text-sm md:text-base text-neutral-700">
                        Weather alerts
                      </span>
                    </label>
                    <label className="flex items-center gap-3 py-2">
                      <input type="checkbox" className="rounded w-4 h-4" />
                      <span className="text-sm md:text-base text-neutral-700">
                        Job reminders
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </SignedIn>

          <SignedOut>
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-soft border border-white/60 p-8 text-center">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                Sign In Required
              </h2>
              <p className="text-neutral-600 mb-6">
                Please sign in to view your profile and manage your account
                settings.
              </p>
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
