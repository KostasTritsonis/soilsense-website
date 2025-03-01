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
    <div className="flex flex-col gap-2 rounded-md shadow-xl bg-zinc-100/50  text-zinc-900/90 hover:bg-blue-200/90 p-4 w-[200px] h-[130px]">
      <h3 className='font-medium flex gap-1 items-center'>{props.title} {props.image && <Image src={props.image} alt={props.title}  className="block" width={15} height={15} />}</h3>
      <p className="text-2xl font-bold">{props.value}</p>
      <p className="text-[12px]">{props.subtitle}</p>
    </div>
  )
}
