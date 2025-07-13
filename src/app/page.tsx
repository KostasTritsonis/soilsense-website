"use client";
import Card from "@/components/card";
import {
  Home as HomeIcon,
  Briefcase,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import WeatherWidget from "@/components/weather/weather-widget";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { createUser, getUserByEmail } from "@/actions";
import MapReadOnly from "@/components/map/map-read-only";
import { useFields } from "@/context/fields-context";
import Link from "next/link";
import JobsWidget from "@/components/jobs/jobs.widget";
import CropWidget from "@/components/crop-widget";
import { useLoadingStore } from "@/lib/stores/loading-store";

export default function Home() {
  const { user, isLoaded } = useUser();
  const { fields, jobs } = useFields();
  const [totalArea, setTotalArea] = useState<number>(0);
  const { setAppLoading } = useLoadingStore();

  useEffect(() => {
    async function fetchUser() {
      if (!isLoaded) {
        console.log("Clerk user is still loading...");
        return; // Don't set email yet
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

  // Personalized greeting
  const greeting = user
    ? `Welcome back, ${user.firstName || user.username || "User"}!`
    : "Welcome to SoilSense!";

  return (
    <main className="min-h-screen w-full bg-gradient-to-tr from-[#f9f5ea] via-[#f3ede1] to-[#e6f4ea] py-8 px-2">
      {/* Top bar: Greeting and profile */}
      <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 px-2">
        <div>
          <h1 className="text-3xl font-bold text-green-800 pb-1">{greeting}</h1>
          <p className="text-zinc-600 text-lg">Your farm at a glance</p>
        </div>
        {/* Profile widget placeholder */}
        <div className="flex items-center gap-3 bg-white rounded-xl shadow-md px-4 py-2">
          {/* TODO: Add user avatar and quick actions */}
          <span className="font-semibold text-green-700">Profile</span>
        </div>
      </div>

      {/* Dashboard grid */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 px-2">
        {/* Left: Overview cards and map */}
        <section className="col-span-2 flex flex-col gap-8">
          {/* Section: Overview */}
          <div>
            <h2 className="text-xl font-semibold text-green-900 pb-3">
              Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <Link
                href="/fields"
                className="hover:scale-105 transition-transform"
              >
                <Card
                  props={{
                    title: "Total Fields",
                    value: `${fields.length}`,
                    subtitle: `${totalArea.toFixed(2)} \u33A1`,
                    icon: <HomeIcon className="w-7 h-7 text-green-700" />,
                  }}
                />
              </Link>
              <Card
                props={{
                  title: "Jobs Active",
                  value: `${
                    jobs?.filter((job) => job.status === "ONGOING").length
                  }`,
                  icon: <Briefcase className="w-7 h-7 text-blue-700" />,
                }}
              />
              <Card
                props={{
                  title: "Jobs Due",
                  value: `${
                    jobs?.filter((job) => job.status === "DUE").length
                  }`,
                  icon: <AlertCircle className="w-7 h-7 text-red-700" />,
                }}
              />
              <Card
                props={{
                  title: "Jobs Done",
                  value: `${
                    jobs?.filter((job) => job.status === "COMPLETED").length
                  }`,
                  icon: <CheckCircle className="w-7 h-7 text-green-700" />,
                }}
              />
            </div>
          </div>

          {/* Section: Map */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-green-900 pb-3">
              Field Map
            </h2>
            <div className="w-full max-w-[900px] rounded-2xl overflow-hidden shadow-lg">
              <MapReadOnly />
            </div>
          </div>
        </section>

        {/* Right: Widgets */}
        <section className="flex flex-col gap-28 pt-2 lg:pt-10">
          <CropWidget />
          <JobsWidget />
          <WeatherWidget />
        </section>
      </div>
    </main>
  );
}
