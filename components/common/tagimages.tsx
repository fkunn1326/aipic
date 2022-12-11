import React from "react";
import useSWR from "swr";
import BlurImage from "./BlurImage";
import SkeletonImage from "./SkeltonImage";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function TagImages({ count, tag }) {
  const { data, error } = useSWR(`../api/tags/${tag}`, fetcher,
  {
    fallbackData: [],
  });

  if (!data)
    return (
      <div>
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
            {Array.apply(0, Array(count)).map(function (x, i) {
              return <SkeletonImage key={i} />;
            })}
          </div>
        </div>
      </div>
    );

  return (
    <div>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
          {data?.slice(0, data.length).slice(0, count).map((image) => (
            <BlurImage key={image.id} image={image} />
          ))}
        </div>
      </div>
    </div>
  );
}
