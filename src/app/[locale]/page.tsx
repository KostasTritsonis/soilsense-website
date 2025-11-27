"use client";
import Card from "@/components/card";
import {
  Home as HomeIcon,
  Error,
  CheckCircle,
  AccessTime,
} from "@mui/icons-material";
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
    <div className="w-full min-w-0 overflow-x-hidden">
      {/* Header Section */}
      <div className="pb-4 md:pb-6 lg:pb-8 min-w-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 md:gap-4 min-w-0">
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-neutral-900 dark:text-neutral-300 pb-1 md:pb-2 break-words">
              {greeting}
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-neutral-600 dark:text-neutral-100 break-words">
              {t("dashboard.agriculturalOperations")}
            </p>
          </div>
          <div className="flex items-center gap-2 md:gap-3 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-soft border border-white/60 dark:border-neutral-700/60 px-3 md:px-4 py-2 md:py-3 flex-shrink-0 min-w-0">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-100 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-primary-700 dark:text-primary-300 font-semibold text-sm">
                {user?.firstName?.[0] || user?.username?.[0] || "U"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm md:text-base text-neutral-900 dark:text-neutral-100 truncate">
                {user?.firstName || user?.username || t("common.user")}
              </p>
              <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 truncate">
                {t("common.farmManager")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 min-w-0">
        {/* Main Content Area */}
        <div className="xl:col-span-3 space-y-4 md:space-y-6 lg:space-y-8 min-w-0">
          {/* Overview Cards */}
          <section className="min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              <Link href={`/${locale}/fields`} className="block min-w-0">
                <Card
                  props={{
                    title: t("dashboard.totalFields"),
                    value: `${fields.length}`,
                    subtitle: `${totalArea.toFixed(2)} ${t("units.hectares")}`,
                    icon: (
                      <HomeIcon
                        className="text-primary-600"
                        fontSize="medium"
                      />
                    ),
                  }}
                />
              </Link>
              <Card
                props={{
                  title: t("dashboard.activeJobs"),
                  value: `${
                    jobs?.filter((job) => job.status === "ONGOING").length || 0
                  }`,
                  icon: (
                    <AccessTime className="text-blue-600" fontSize="medium" />
                  ),
                }}
              />
              <Card
                props={{
                  title: t("dashboard.dueJobs"),
                  value: `${
                    jobs?.filter((job) => job.status === "DUE").length || 0
                  }`,
                  icon: <Error className="text-orange-600" fontSize="medium" />,
                }}
              />
              <Card
                props={{
                  title: t("dashboard.completed"),
                  value: `${
                    jobs?.filter((job) => job.status === "COMPLETED").length ||
                    0
                  }`,
                  icon: (
                    <CheckCircle className="text-green-600" fontSize="medium" />
                  ),
                }}
              />
            </div>
          </section>

          {/* Field Map */}
          <section className="min-w-0">
            <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl shadow-soft overflow-hidden min-w-0">
              <MapReadOnly />
            </div>
          </section>
        </div>

        {/* Sidebar Widgets */}
        <div className="xl:col-span-1 space-y-4 min-w-0">
          <CropWidget />
          <JobsWidget />
          <WeatherWidget />
        </div>
      </div>
    </div>
  );
}
