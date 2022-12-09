import Image from "next/image";
import React, { useState, useEffect, useContext } from "react";
import { userInfoContext } from "../../context/userInfoContext";
import useSWR from "swr";
import BlurImage from "../../components/common/BlurImage";
import SkeletonImage from "../../components/common/SkeltonImage";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function PromptRanking() {
  var ctx = useContext(userInfoContext);

  const { data, error } = useSWR(
    "../api/prompt_ranking",
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

  const images = data.slice(0, 6);

  return (
    <div>
      <div className="mx-auto max-w-2xl mb-12 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 xl:gap-x-8">
          {images.map((image, idx) => (
            <div className="relative">
            	<BlurImage key={image.id} image={image} pr preview />
							<p className="absolute bottom-0 left-0 px-4 pb-4 pt-32 w-full rounded-b-xl text-white font-semibold bg-gradient-to-t from-transparent/[0.3] to-transparent">{image.prompt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
