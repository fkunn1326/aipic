import Image from "next/image";
import React, { useState, useEffect, useContext } from "react";
import Header from "../components/header/header";
import Footer from "../components/footer";
import { userInfoContext } from "../context/userInfoContext";
import useSWR from "swr";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  HeartIcon as HeartSolidIcon,
  EyeIcon,
  ClipboardIcon,
} from "@heroicons/react/24/solid";
import SkeletonImage from "../components/common/SkeltonImage"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const fetcher = (url) => fetch(url).then((r) => r.json());

export const getServerSideProps = async ({ req, res, query: { page } } ) => {
  const supabase = createServerSupabaseClient({req ,res})
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
  
  const { data } = await supabase.from('profiles').select('*').eq("id", session.user.id).single();

  const artworks = await axios.get(`${process.env.BASE_URL}/api/users/${data.uid}?page=${page ? page : 1}`, {
    withCredentials: true,
    headers: {
        Cookie: req?.headers?.cookie
    }
  })

  return {
    props: {
      user: data,
      artworks: artworks.data
    },
  }
}

export default function App({ user , artworks}) {
  const router = useRouter();
  const ctx = useContext(userInfoContext);
  const page =
    router.query.page !== undefined ? parseInt(router.query.page as string) : 1;

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

  if (!artworks)
    return (
      <div className="bg-white dark:bg-slate-900">
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
  
  const totalPage = Math.ceil(artworks.count / 20);

  return (
    <div className="bg-white dark:bg-slate-900">
      <Header></Header>
      <div className="mx-auto max-w-7xl p-6 sm:px-12">
        <div className="mt-6 text-2xl font-semibold dark:text-white">
          投稿した作品
        </div>
      </div>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8 mb-12">
        <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
          {artworks.body?.map((image) => (
            <BlurImage key={image.id} image={image} data={artworks[0]} />
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-x-4 text-lg">
        {getpagenation().map((count, idx) => (
          <Link
            href={`${
              count !== "..." ? `/dashboard?page=${count}` : `/dashboard?page=${page}`
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

function BlurImage({ image, data }) {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className="group">
      <div className="relative">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
          <Link href={`/artworks/${image.id}`}>
            <Image
              alt={image.title}
              src={image.href}
              layout="fill"
              objectFit="cover"
              className={cn(
                "duration-700 ease-in-out group-hover:opacity-75",
                isLoading
                  ? "scale-110 blur-2xl grayscale"
                  : "scale-100 blur-0 grayscale-0"
              )}
              onLoadingComplete={() => {
                setLoading(false);
              }}
            />
          </Link>
        </div>
        {image.age_limit === "nsfw" && (
          <p className="absolute bottom-2 right-4 text-sm font-semibold bg-red-500 text-white px-2 rounded-md">
            NSFW
          </p>
        )}
        {image.age_limit === "r18" && (
          <p className="absolute bottom-2 right-4 text-sm font-semibold bg-red-500 text-white px-2 rounded-md">
            R-18
          </p>
        )}
        {image.age_limit === "r18g" && (
          <p className="absolute bottom-2 right-4 text-sm font-semibold bg-red-500 text-white px-2 rounded-md">
            R-18G
          </p>
        )}
      </div>
      <p className="mt-2 text-base font-semibold text-gray-900 text-ellipsis whitespace-nowrap overflow-hidden">
        {image.title}
      </p>
      <div className="flex flex-row gap-x-4 items-center mt-4 text-sm text-gray-500 w-max">
        <div className="flex flex-row items-center">
          <HeartSolidIcon className="w-4 h-4 mr-1" />
          {image.likes.length}
        </div>
        <div className="flex flex-row items-center">
          <EyeIcon className="w-4 h-4 mr-1" />
          {image.views}
        </div>
        <div className="flex flex-row items-center">
          <ClipboardIcon className="w-4 h-4 mr-1" />
          {image.copies}
        </div>
      </div>
    </div>
  );
}
