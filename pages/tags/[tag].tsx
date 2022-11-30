import Image from "next/image";
import React, { useContext } from "react";
import Header from "../../components/header/header";
import { userInfoContext } from "../../context/userInfoContext";
import useSWR from "swr";
import { useRouter } from "next/router";
import BlurImage from "../../components/common/BlurImage";
import SkeletonImage from "../../components/common/SkeltonImage";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Tag() {
  const ctx = useContext(userInfoContext);
  const router = useRouter();
  const { tag }: any = router.query;
  const { data, error } = useSWR(
    `../api/tags/${tag}?`, fetcher
  );

  if (!data)
    return (
      <div>
        <Header></Header>
        <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
            {Array.apply(0, Array(10)).map(function (x, i) {
              return <SkeletonImage key={i} />;
            })}
          </div>
        </div>
      </div>
    );
  var images = data.slice(0, data.length);
  return (
    <div>
      <Header></Header>
      <div className="mx-auto max-w-7xl p-6 sm:px-12">
        <div className="pt-6 text-2xl font-semibold">#{tag}</div>
        <div className="flex flex-row gap-x-1 pt-6 items-center font-semibold">
          <p className="text-base">{images.length}</p>
          <p className="text-sm text-gray-600">作品</p>
        </div>
      </div>
      <div className="mx-auto max-w-2xl px-4 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
          {images.reverse().map((image) => (
            <BlurImage key={image.id} image={image} />
          ))}
        </div>
      </div>
    </div>
  );
}
