import Image from "next/image";
import React, { useState, useEffect, useContext } from "react";
import { userInfoContext } from "../../context/userInfoContext";
import useSWR from "swr";
import BlurImage from "../../components/common/BlurImage"
import Link from "next/link";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function TagsList() {
  const colors = ["red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose"]
  const { data, error } = useSWR(
    "../api/tags/list",
     fetcher,
     {
        fallbackData: []
     }
  );

  if (!data)
    return (
      <div>
        <div className="bg-pink-500 mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
            {Array.apply(0, Array(10)).map(function (x, i) {
              return <div key={i}></div>
            })}
          </div>
        </div>
      </div>
  );

  return (
    <div>
      <div className="mx-auto w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8 overflow-scroll hidden-scrollbar">
        <div className="flex flex-row gap-x-2 mt-8 w-max">
          {data.slice(0,20).map((tag,idx) => (
            <div className={`px-4 py-2.5 bg-${colors[idx%colors.length]}-500 rounded text-white font-semibold`} key={tag.id}>
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