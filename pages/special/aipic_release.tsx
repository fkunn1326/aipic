import Image from "next/image";
import React, { useState, useEffect, useContext } from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer";
import { userInfoContext } from "../../context/userInfoContext";
import useSWR from "swr";
import BlurImage from "../../components/common/BlurImage";
import SkeletonImage from "../../components/common/SkeltonImage";
import { ArrowUpIcon } from "@heroicons/react/24/solid";
import { supabaseClient } from "../../utils/supabaseClient";
import { useRouter } from "next/router";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function App() {
  var ctx = useContext(userInfoContext);
  var access_limit = "";

  if (ctx.UserInfo !== null) {
    access_limit =
      "?" + new URLSearchParams(ctx.UserInfo.access_limit).toString();
  }

  const { data, error } = useSWR(
    "../api/tags/AIPICリリース記念" + access_limit,
    fetcher,
    {
      fallbackData: [],
    }
  );

  if (!data)
    return (
      <div className="dark:bg-slate-900">
        <Header></Header>
        <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
            {Array.apply(0, Array(10)).map(function (x, i) {
              return <SkeletonImage key={i} />;
            })}
          </div>
        </div>
        <Footer />
      </div>
    );

  return (
    <div className="dark:bg-slate-900">
      <Header></Header>
      <div className="mx-auto max-w-7xl py-8 px-4 sm:px-10">
        <div className="mt-6 w-full flex flex-row justify-between">
          <div className="text-xl font-semibold dark:text-white">
            リリース記念!
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-2xl mb-12 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
          {data.map((image) => (
            <BlurImage key={image.id} image={image} />
          ))}
        </div>
      </div>
      <button
        className="fixed right-0 bottom-0"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <ArrowUpIcon className="w-12 h-12 bg-gray-400 text-white rounded-full p-3 m-12" />
      </button>
      <Footer />
    </div>
  );
}
