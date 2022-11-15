import Link from "next/link";
import Image from "next/image"
import React, { useContext, useLayoutEffect, useState } from "react";
import useSWR from "swr";

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Challange(props) {
    const [isLoading, setLoading] = useState(true);
    const { data, error } = useSWR(
        "../api/challenge/challenge",
         fetcher
    );

    if (!data){
        return(
            <div className="grid p-6 items-center grid-cols-2 col-span-2 bg-gray-200 animate-puls rounded-2xl"/>
        )
    }
  
    return (
        <div className="grid p-6 items-center grid-cols-2 col-span-2 border-2 rounded-2xl">
            <div className="relative">
                <div className="cursor-pointer aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                    <Image
                        alt={"今日のチャレンジ"}
                        src={data[0].href}
                        layout="fill"
                        objectFit="cover"
                        priority={true}
                        sizes="(max-width: 768px) 50vw,
                        (max-width: 1200px) 30vw,
                        20vw"
                        className={cn(
                            "duration-700 ease-in-out group-hover:opacity-75",
                            isLoading
                            ? "scale-110 blur-2xl grayscale"
                            : "scale-100 blur-0 grayscale-0"
                            // image.age_limit !== 'all'
                            //   ? 'blur-md'
                            //   : ''
                        )}
                        onLoadingComplete={() => {
                            setLoading(false);
                        }}
                    />
                </div>
            </div>
            <div className="w-full h-full p-5">
                <p className="text-sm text-gray-500 font-semibold mb-3">今日（{new Date().getMonth() + 1}/{new Date().getDate()}）のチャレンジ</p>
                <div className="mb-1">
                    {data[0].challenge.map((prompt) => (
                        <p className="text-sm font-semibold" key={prompt}>{prompt}</p>
                    ))}
                </div>
                <Link href="/search/今日のチャレンジ">
                    <a className="text-sm font-semibold text-sky-600 mb-1">#今日のチャレンジ</a>
                </Link>
                <div className="mt-2 px-8 py-1.5 bg-sky-500 rounded-full text-sm w-max text-white font-semibold">
                    <Link href="/upload?tag=今日のチャレンジ">
                        <a>投稿する</a>
                    </Link>
                </div>
            </div>
        </div>
    );
  }