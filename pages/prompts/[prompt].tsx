import Image from "next/image";
import React, { useState, useEffect, useContext } from "react";
import Header from "../../components/header/header";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { userInfoContext } from "../../context/userInfoContext";
import useSWR from "swr";
import Link from "next/link";
import { useRouter } from "next/router";

export const getServerSideProps = async (context) => {
  const { prompt } = context.query
  const res = await fetch(`https:/${context.req.headers.host}/api/prompts/${decodeURIComponent(prompt)}`)
  const data = await res.json()

  return { props: {
    data: data,
  }}
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Prompt({data}) {
  const router = useRouter()
  const { prompt }: any = router.query;

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
      <div className="mx-auto max-w-7xl px-12">
        <div className="pt-6 text-2xl font-semibold">
          {prompt}
        </div>
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

function BlurImage({ image }) {
  const [isLoading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="group" onClick={() => setIsOpen(true)}>
      <div className="relative">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
          <Link href={`/images/${image.id}`}>
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
                // image.age_limit !== 'all'
                //   ? 'blur-md'
                //   : ''
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
      <p className="mt-2 text-base font-semibold text-gray-900">
        {image.title}
      </p>
      <Link href={`/users/${image.author.uid}`}>
        <a className="mt-1 w-full flex items-center">
          <Image
            src={image.author.avatar_url}
            width={20}
            height={20}
            className="rounded-full"
          ></Image>
          <h3 className="ml-2 text-base text-gray-700">{image.author.name}</h3>
        </a>
      </Link>
    </div>
  );
}

function SkeletonImage() {
  return (
    <div className="group">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 animate-pulse"></div>
      <div className="mt-2 rounded-full bg-gray-200 h-3 w-32"></div>
      <div className="mt-1 w-full flex items-center">
        <div className="h-5 w-5 rounded-full bg-gray-200"></div>
        <div className="ml-2 rounded-full bg-gray-200 h-3 w-16"></div>
      </div>
    </div>
  );
}
