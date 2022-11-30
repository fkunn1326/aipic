import React, { useState, useEffect, useContext, useRef } from "react";
import useSWR from "swr";
import Link from "next/link";
import axios from "axios";

function useHorizontalScroll() {
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

export default function TagsList({ tags }) {
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


  if (!tags)
    return (
      <div className="h-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
            {Array.apply(0, Array(10)).map(function (x, i) {
              return <div key={i}></div>;
            })}
          </div>
        </div>
      </div>
    );

  return (
    <div className="h-8">
      <div className="hidden bg-red-500 bg-orange-500 bg-amber-500 bg-yellow-500 bg-lime-500 bg-green-500 bg-emerald-500 bg-teal-500 bg-cyan-500 bg-sky-500 bg-blue-500 bg-indigo-500 bg-violet-500 bg-purple-500 bg-fuchsia-500 bg-pink-500 bg-rose-500"></div>
      <div
        className="mx-auto w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8 overflow-scroll hidden-scrollbar mt-8"
        ref={scrollRef}
      >
        {/* <div className="absolute flex justify-between">
          <p>saa</p>
          <p>aaa</p>
        </div> */}
        <div className="flex flex-row gap-x-2 w-max">
          {tags.slice(0, 20).map((tag, idx) => (
            <div
              className={`px-4 py-2 bg-${
                colors[idx % colors.length]
              }-500 rounded saturate-[0.8] text-white font-semibold`}
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
