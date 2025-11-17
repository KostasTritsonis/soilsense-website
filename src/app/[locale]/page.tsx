"use client";
import Card from "@/components/card";
import {
  Home as HomeIcon,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import WeatherWidget from "@/components/weather/weather-widget";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { createUser, getUserByEmail } from "@/actions";
import MapReadOnly from "@/components/map/map-read-only";
import { useFieldsStore } from "@/lib/stores/fields-store";
import { useJobsStore } from "@/lib/stores/jobs-store";
import Link from "next/link";
import JobsWidget from "@/components/jobs/jobs.widget";
import CropWidget from "@/components/crop-widget";
import { useLoadingStore } from "@/lib/stores/loading-store";
import { useLocale, useTranslations } from "next-intl";

export default function Home() {
  const { user, isLoaded } = useUser();
  const { fields } = useFieldsStore();
  const { jobs } = useJobsStore();
  const [totalArea, setTotalArea] = useState<number>(0);
  const { setAppLoading } = useLoadingStore();
  const locale = useLocale();
  const t = useTranslations();

  useEffect(() => {
    async function fetchUser() {
      if (!isLoaded) {
        console.log("Clerk user is still loading...");
        return;
      }
      if (user) {
        if (await getUserByEmail(user.emailAddresses[0].emailAddress)) {
          return;
        }
        await createUser(
          user.username ?? "",
          user.emailAddresses[0].emailAddress
        );
      }
    }

    const initializeData = async () => {
      setAppLoading(true, "SoilSense");
      const timeoutId = setTimeout(() => {
        setAppLoading(false);
      }, 10000);
      try {
        await fetchUser();
      } finally {
        clearTimeout(timeoutId);
        setAppLoading(false);
      }
    };
    initializeData();
  }, [isLoaded, user, setAppLoading]);

  useEffect(() => {
    setTotalArea(0);
    fields.forEach((field) => {
      setTotalArea((prev) => prev + field.area);
    });
  }, [fields]);

  const greeting = user
    ? t("dashboard.welcomeBack", {
        name: user.firstName || user.username || t("common.user"),
      })
    : t("dashboard.welcome");

  return (
    <div className="w-full min-w-0">
      {/* Header Section */}
      <div className="pb-3 sm:pb-4 md:pb-6 lg:pb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 sm:gap-3 md:gap-4">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-neutral-900 dark:text-neutral-300 pb-0.5 sm:pb-1 md:pb-2">
              {greeting}
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-neutral-600 dark:text-neutral-100">
              {t("dashboard.agriculturalOperations")}
            </p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl shadow-soft border border-white/60 dark:border-neutral-700/60 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3">
            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-primary-100 rounded-md sm:rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-primary-700 dark:text-primary-300 font-semibold text-[10px] sm:text-xs md:text-sm">
                {user?.firstName?.[0] || user?.username?.[0] || "U"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-xs sm:text-sm md:text-base text-neutral-900 dark:text-neutral-100 truncate">
                {user?.firstName || user?.username || t("common.user")}
              </p>
              <p className="text-[10px] sm:text-xs md:text-sm text-neutral-500 dark:text-neutral-400 truncate">
                {t("common.farmManager")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
        {/* Main Content Area */}
        <div className="xl:col-span-3 space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8">
          {/* Overview Cards */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 lg:gap-6">
              <Link href={`/${locale}/fields`} className="block">
                <Card
                  props={{
                    title: t("dashboard.totalFields"),
                    value: `${fields.length}`,
                    subtitle: `${totalArea.toFixed(2)} ${t("units.hectares")}`,
                    icon: <HomeIcon className="w-6 h-6 text-primary-600" />,
                  }}
                />
              </Link>
              <Card
                props={{
                  title: t("dashboard.activeJobs"),
                  value: `${
                    jobs?.filter((job) => job.status === "ONGOING").length || 0
                  }`,
                  icon: <Clock className="w-6 h-6 text-blue-600" />,
                }}
              />
              <Card
                props={{
                  title: t("dashboard.dueJobs"),
                  value: `${
                    jobs?.filter((job) => job.status === "DUE").length || 0
                  }`,
                  icon: <AlertCircle className="w-6 h-6 text-orange-600" />,
                }}
              />
              <Card
                props={{
                  title: t("dashboard.completed"),
                  value: `${
                    jobs?.filter((job) => job.status === "COMPLETED").length ||
                    0
                  }`,
                  icon: <CheckCircle className="w-6 h-6 text-green-600" />,
                }}
              />
            </div>
          </section>

          {/* Field Map */}
          <section>
            <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-soft overflow-hidden">
              <MapReadOnly />
            </div>
          </section>
        </div>

        {/* Sidebar Widgets */}
        <div className="xl:col-span-1 space-y-2 sm:space-y-4 md:space-y-4">
          <CropWidget />
          <JobsWidget />
          <WeatherWidget />
        </div>
      </div>
    </div>
  );
}
