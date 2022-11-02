import Image from "next/image";
import React, { useState, useEffect, useContext } from "react";
import Header from "../components/header/header";
import Link from "next/link";
import { useRouter } from "next/router";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const getServerSideProps = withPageAuth({ redirectTo: "/" });

export default function App() {
  const [data, setdata] = useState<any[]>([])

  useEffect(() => {
    if(localStorage.getItem("history") !== null){
        setdata(JSON.parse(localStorage.getItem("history") as string))
    }
  }, [])

  const router = useRouter()

  const handleclear  = (e) => {
    localStorage.setItem("history", JSON.stringify([]))
    router.push("/")
  }
  
  if (!data)
    return (
      <div>
        <Header></Header>
        <div className="mx-auto max-w-7xl flex px-6 sm:px-12">
            <div className="pt-6 text-2xl font-semibold">
                履歴を削除
            </div>
        </div>
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
      <div className="pt-6 flex flex-row items-center mx-auto max-w-7xl px-6 sm:px-12">
        <div className="text-2xl font-semibold">
            閲覧履歴
        </div>
        <button 
            className="ml-4 text-sm border transition-colors ease-in-out duration-300 text-sky-500 border-sky-500 hover:bg-sky-500 hover:text-white rounded-xl px-2 py-1"
            onClick={(e) => {handleclear(e)}}
        >
            履歴を削除
        </button>
      </div>
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
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
      <p className="mt-2 text-base font-semibold text-gray-900 text-ellipsis whitespace-nowrap overflow-hidden">
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