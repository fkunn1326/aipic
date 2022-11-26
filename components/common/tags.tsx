import Image from "next/image";
import React, { useState, useEffect, useContext, useRef } from "react";
import { userInfoContext } from "../../context/userInfoContext";
import useSWR from "swr";
import BlurImage from "../../components/common/BlurImage";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((r) => r.json());

export function useHorizontalScroll() {
  const elRef = useRef<null | HTMLDivElement>(null);
  useEffect(() => {
    const el = elRef.current;
    if (el) {
      const onWheel = (e) => {
        if (e.deltaY == 0) return;
        e.preventDefault();
        el.scrollBy(e.deltaY, 0);
      };
      el.addEventListener("wheel", onWheel);
      return () => el.removeEventListener("wheel", onWheel);
    }
  }, []);
  return elRef;
}

export default function TagsList() {
  const scrollRef = useHorizontalScroll();

  const divRef = useRef<HTMLDivElement | null>(null);
  const colors = [
    "red",
    "orange",
    "amber",
    "yellow",
    "lime",
    "green",
    "emerald",
    "teal",
    "cyan",
    "sky",
    "blue",
    "indigo",
    "violet",
    "purple",
    "fuchsia",
    "pink",
    "rose",
  ];
  const { data, error } = useSWR("../api/tags/list", fetcher, {
    fallbackData: [],
  });

  if (!data)
    return (
      <div>
        <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
            {Array.apply(0, Array(10)).map(function (x, i) {
              return <div key={i}></div>;
            })}
          </div>
        </div>
      </div>
    );

  return (
    <div>
      <div className="hidden bg-red-600 bg-orange-600 bg-amber-600 bg-yellow-600 bg-lime-600 bg-green-600 bg-emerald-600 bg-teal-600 bg-cyan-600 bg-sky-600 bg-blue-600 bg-indigo-600 bg-violet-600 bg-purple-600 bg-fuchsia-600 bg-pink-600 bg-rose-600"></div>
      <div
        className="mx-auto w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8 overflow-scroll hidden-scrollbar mt-8"
        ref={scrollRef}
      >
        {/* <div className="absolute flex justify-between">
          <p>saa</p>
          <p>aaa</p>
        </div> */}
        <div className="flex flex-row gap-x-2 w-max">
          {data.slice(0, 20).map((tag, idx) => (
            <div
              className={`px-4 py-2.5 bg-${
                colors[idx % colors.length]
              }-600 rounded text-white font-semibold`}
              key={tag.id}
            >
              <Link href={`/search/${tag.name}`}>
                <a>#{tag.name}</a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
