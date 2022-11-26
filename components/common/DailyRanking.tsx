import Image from "next/image";
import React, { useState, useEffect, useContext } from "react";
import { userInfoContext } from "../../context/userInfoContext";
import useSWR from "swr";
import BlurImage from "../../components/common/BlurImage";
import SkeletonImage from "../../components/common/SkeltonImage";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function DailyRanking() {
  var ctx = useContext(userInfoContext);
  var access_limit = "";

  if (ctx.UserInfo !== null) {
    access_limit =
      "?" + new URLSearchParams(ctx.UserInfo.access_limit).toString();
  }

  const { data, error } = useSWR(
    "../api/daily_ranking" + access_limit,
    fetcher,
    {
      fallbackData: [],
    }
  );

  if (!data)
    return (
      <div>
        <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
            {Array.apply(0, Array(5)).map(function (x, i) {
              return <SkeletonImage key={i} />;
            })}
          </div>
        </div>
      </div>
    );

  const images = data.slice(0, 5);

  return (
    <div>
      <div className="mx-auto max-w-2xl mb-12 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
          {images.map((image, idx) => (
            <BlurImage key={image.id} image={image} rank={idx + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
