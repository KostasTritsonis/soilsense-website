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

export default function Home() {

  const { user, isLoaded } = useUser();
  const { fields, isLoading,jobs } = useFields();
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
    fetchUser();
  }, [isLoaded]);

  useEffect(() => {
    fields.forEach(field=>{
      setTotalArea((prev) => (prev + field.area))
    })
  }, [isLoading]);

  
  return (
    <main className="flex justify-center items-center">
      <section className="flex flex-col">
        <div className="flex w-[900px] h-[130px] mt-3 justify-evenly">
          <Link href="/fields" ><Card props={{title:"Total Fields",value:`${fields.length}`,subtitle:`${totalArea.toFixed(2)}\u33A1`}} /></Link>
          <Card props={{title:"Jobs Active",value:`${jobs?.filter((job) => job.status === "ONGOING").length}`,image:active}} />
          <Card props={{title:"Jobs Due",value:`${jobs?.filter((job) => job.status === "DUE").length}`,image:due}} />
          <Card props={{title:"Jobs Completed",value:`${jobs?.filter((job) => job.status === "COMPLETED").length}`,image:completed}} />
        </div>
        <div className="w-[900px] h-[700px] shadow-xl rounded-md">
          <MapReadOnly />
        </div>
      </section>
      <section className="flex flex-col ml-12 mt-7">
        <div className="rounded-md shadow-xl  bg-zinc-100/50 w-[400px] h-[330px]">
          <div className="flex border-b border-zinc-400/20">
            <h2 className="text-lg font-semibold p-4">Crop distribution</h2>
            <p className="border rounded-md border-zinc-200/20 bg-zinc-200/40 p-1 ml-auto m-4 text-[15px] text-green-700 font-semibold">2025</p>
          </div>
          <div className="w-44 h-44 mx-auto my-9">
            <CropDistribution  />
          </div>
        </div>
        <div className="rounded-md shadow-xl  mt-12 bg-zinc-100/50 w-[400px] h-[250px]">
          <div className="flex border-b border-zinc-400/20">
            <h2 className="text-lg font-semibold p-4">Recent due jobs</h2>
            <p className="border rounded-md border-zinc-200/20 bg-zinc-200/40 p-1 ml-auto m-4 text-[15px] text-green-700 font-semibold">See all</p>
          </div>
        </div>
        <WeatherWidget />
      </section>   
    </main>
  );
}
