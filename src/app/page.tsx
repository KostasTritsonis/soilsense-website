'use client';
import Card from "@/components/card";
import due from "../../public/due.png"
import completed from "../../public/completed.png"
import active from "../../public/active.png"
import WeatherWidget from "@/components/weather/weather-widget";;
import CropDistribution from "@/components/crop-distribution";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { createUser, getUserByEmail } from "@/actions";
import MapReadOnly from "@/components/map/map-read-only";
import { useFields } from "@/context/fields-context";
import Link from "next/link";
import JobsWidget from "@/components/jobs/jobs.widget";

export default function Home() {

  const { user, isLoaded } = useUser();
  const { fields,jobs } = useFields();
  const [totalArea, setTotalArea] = useState<number>(0);

  useEffect(() => {
    async function fetchUser() {
      if (!isLoaded) {
        console.log("Clerk user is still loading...");
        return; // Don't set email yet
      }
      if(user) {
        if(await getUserByEmail(user.emailAddresses[0].emailAddress)) {return};
        await createUser(user.username??"",user.emailAddresses[0].emailAddress)
      };
      
    }
    setTotalArea(0); 
    fields.forEach(field=>{
      setTotalArea((prev) => (prev + field.area))
    })
    fetchUser();

    
  }, [isLoaded,user,fields]);

  return (
    <main className="flex flex-col lg:flex-row justify-center items-center p-4 max-sm:pb-[80px]">
      <section className="flex flex-col items-center">
        <div className="flex flex-wrap gap-4 w-full max-sm:justify-center max-w-[900px] mt-3">
          <Link href="/fields">
            <Card props={{ title: "Total Fields", value: `${fields.length}`, subtitle: `${totalArea.toFixed(2)} \u33A1 (${(totalArea / 1000).toFixed(1)} acres)` }} />
          </Link>
          <Card props={{ title: "Jobs Active", value: `${jobs?.filter((job) => job.status === "ONGOING").length}`, image: active }} />
          <Card props={{ title: "Jobs Due", value: `${jobs?.filter((job) => job.status === "DUE").length}`, image: due }} />
          <Card props={{ title: "Jobs Completed", value: `${jobs?.filter((job) => job.status === "COMPLETED").length}`, image: completed }} />
        </div>

        <div className="w-full max-w-[900px] h-auto shadow-xl rounded-md mt-4">
          <MapReadOnly />
        </div>
      </section>
      <section className="flex flex-col items-center lg:items-start lg:ml-12 md:ml-8 mt-7 w-full max-w-[400px] md:w-[350px]">
        <div className="rounded-md shadow-xl bg-zinc-100/50 w-full h-auto">
          <div className="flex border-b border-zinc-400/20 p-4">
            <h2 className="text-lg font-semibold">Crop Distribution</h2>
            <p className="border rounded-md border-zinc-200/20 bg-zinc-200/40 p-1 ml-auto text-[15px] text-green-700 font-semibold">2025</p>
          </div>
          <div className="w-44 h-44 mx-auto my-4">
            <CropDistribution />
          </div>
        </div>

        <div className="w-full sm:mt-4">
          <JobsWidget />
        </div>

        <div className="w-full sm:mt-4">
          <WeatherWidget />
        </div>
      </section>
  </main>

  );
}
