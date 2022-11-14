import Image from "next/image";
import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer";
import { userInfoContext } from "../../context/userInfoContext";
import useSWR from "swr";
import BlurImage from "../../components/common/BlurImage"
import SkeletonImage from "../../components/common/SkeltonImage"
import { ArrowUpIcon } from "@heroicons/react/24/solid";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function App() {
  const ctx = useContext(userInfoContext);
  const router = useRouter()
  const { keyword } = router.query
  var access_limit = ""

  if (ctx.UserInfo !== null) {
    access_limit = "?" + new URLSearchParams(ctx.UserInfo.access_limit).toString()
  }

  useLayoutEffect(() => {
    var el = document.getElementById("searchbox") as HTMLInputElement
    el.value = keyword as string
  },[router.isReady])

  const { data, error } = useSWR(
    "../api/search" + access_limit + "&keyword=" + keyword,
     fetcher,
     {
        fallbackData: []
     }
  );

  const count = data?.length

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
        <Footer/>
      </div>
  );

  return (
    <div>
      <Header></Header>
      <div className="mx-auto max-w-7xl py-8 px-4 sm:px-10">
        <div className="mt-6 w-full flex flex-row justify-between">
          <div className="text-xl font-semibold">
            {keyword} の検索結果: {count}件
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
      <button className="fixed right-0 bottom-0" onClick={() => {window.scrollTo({top: 0, behavior: 'smooth'})}}>
        <ArrowUpIcon className="w-12 h-12 bg-gray-400 text-white rounded-full p-3 m-12" />
      </button>
      <Footer/>
    </div>
  );
}