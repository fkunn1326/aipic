import Image from "next/image";
import React, { useState, useEffect, useContext } from "react";
import { userInfoContext } from "../../context/userInfoContext";
import useSWRImmutable from 'swr/immutable'
import BlurImage from "./BlurImage"
import SkeletonImage from "./SkeltonImage"

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function OtherImages({ count }) {
  var ctx = useContext(userInfoContext);
  var access_limit = ""
  const [images, setimages] = useState<any[]>([])
  
  if (ctx.UserInfo !== null) {
    access_limit = "?" + new URLSearchParams(ctx.UserInfo.access_limit).toString()
  }

  const shuffle = ([...array]) => {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const { data, error } = useSWRImmutable(
    "../api/images/list" + access_limit,
     fetcher,
     {
      dedupingInterval: 3600000,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    if (data !== undefined){
      var images = shuffle(data.slice(0, data.length));
      setimages(images.slice(0, count))
    }
  },[data])

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
          {images.map((image) => (
            <BlurImage key={image.id} image={image} />
          ))}
        </div>
      </div>
    </div>
  );
}