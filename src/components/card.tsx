import Image, { StaticImageData } from 'next/image';
import React from 'react'

type CardProps = {
  props: {
    title: string;
    value: string;
    subtitle?: string;
    image?: StaticImageData;
  };
};

export default function Card({props}:CardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl shadow-xl bg-white  text-zinc-900 hover:bg-green-400/70 p-3 xl:w-[200px] sm:w-[130px] w-[120px] h-[130px]">
      <h3 className='flex gap-1 items-center text-transparent/60'>{props.title} {props.image && <Image src={props.image} alt={props.title}  className="block" width={15} height={15} />}</h3>
      <p className="pt-4 text-2xl font-bold">{props.value}</p>
      <p className="text-[12px]">{props.subtitle}</p>
    </div>
  )
}
