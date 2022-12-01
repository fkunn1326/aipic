import Image from "next/image";
import React, { useState, useEffect, useContext } from "react";
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import Header from "../components/header/header";
import Footer from "../components/footer";
import useSWR from "swr";
import BlurImage from "../components/common/BlurImage";
import SkeletonImage from "../components/common/SkeltonImage";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";

const fetcher = (url) => fetch(url).then((r) => r.json());

export const getServerSideProps = async ({ req, res, locale, query: { page } }) => {
  const supabase = createServerSupabaseClient({req, res})
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }

  const likes = await axios.get(`${process.env.BASE_URL}/api/userlikes?page=${page ? page : 1}`, {
    withCredentials: true,
    headers: {
        Cookie: req?.headers?.cookie
    }
  })

  return {
    props: {
      likes: likes.data
    },
  }
}

export default function App({ likes }) {
  const router = useRouter();
  const page = router.query.page !== undefined ? parseInt(router.query.page as string) : 1;

  const { data, error } = useSWR(
    "../api/userlikes" + "?page=" + page , fetcher,{
      fallbackData: likes
    }
  );

  const getpagenation = () => {
    var startPage = page - 2;
    var endPage = page + 2;
    var arr: any[] = [];

    if (startPage <= 0) {
      endPage -= startPage - 1;
      startPage = 1;
    }

    if (endPage > totalPage) endPage = totalPage;

    if (startPage > 1) arr.push("...");
    for (var i = startPage; i <= endPage; i++) arr.push(i);
    if (endPage < totalPage) arr.push("...");
    if (endPage < totalPage) arr.push(totalPage);
    if (startPage > 1 && endPage < totalPage) arr.splice(0, 1);

    return arr;
  };

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

  const totalPage = Math.ceil(data.count / 20);

  return (
    <div className="dark:bg-slate-900">
      <Header></Header>
      <div className="mx-auto max-w-7xl p-6 sm:px-12">
        <div className="mt-6 text-2xl font-semibold dark:text-white">
          いいねをした作品
        </div>
      </div>
      <div className="mx-auto max-w-2xl mb-12 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
          {data?.body.map((image) => (
            <BlurImage key={image?.artworks.id} image={image?.artworks} />
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-x-4 text-lg">
        {getpagenation().map((count, idx) => (
          <Link
            href={`${
              count !== "..." ? `/likes?page=${count}` : `/likes?page=${page}`
            }`}
            key={idx}
          >
            <button
              key={idx}
              className={`w-10 h-10 border dark:text-white rounded-lg  ${
                page === count && "bg-sky-500 border-none text-white"
              }`}
            >
              {count}
            </button>
          </Link>
        ))}
      </div>
      <Footer />
    </div>
  );
}
