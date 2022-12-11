import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import { HeartIcon, DocumentIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { userInfoContext } from "../../context/userInfoContext";
import { supabaseClient } from "../../utils/supabaseClient";
import axios from "axios";
import { useRouter } from "next/router";
import { t } from "../../utils/Translation"

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function BlurImage({ image, rank=undefined, preview=false, pr=false }) {
  const ctx = useContext(userInfoContext);

  const [isLoading, setLoading] = useState(true);
  const [isliked, setisliked] = useState(false);
  const [isError, setisError] = useState(false)

  const ref = useRef<null | HTMLImageElement>(null)

  const gethref = (str: string, size=256) => {
    if (str?.endsWith("/public")) {
      return str?.replace("/public", `/h=${size}`);
    } else return str;
  };

  const handlelike = async (e) => {
    if (ctx.UserInfo?.id !== undefined) {
      if (isliked) {
        await supabaseClient.from("likes").delete().match({
          artwork_id: image.id,
          user_id: ctx.UserInfo.id,
        });
        setisliked(false);
        await axios.post(
          "/api/likes",
          JSON.stringify({
            token: `${supabaseClient?.auth?.getSession()}`,
            artwork_id: `${image.id}`,
            type: "delete",
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        await supabaseClient.from("likes").insert({
          artwork_id: image.id,
          user_id: ctx.UserInfo.id,
        });
        setisliked(true);
        await axios.post(
          "/api/likes",
          JSON.stringify({
            token: `${supabaseClient?.auth?.getSession()}`,
            artwork_id: `${image.id}`,
            type: "add",
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    }
  };

  const router = useRouter()

  useEffect(() => {
    if (ctx.UserInfo){
      if (image !== undefined) {
        image?.likes?.map((like) => {
          if (like.user_id === ctx.UserInfo?.id) {
            setisliked(true);
          }
        });
      }
    }
    if (typeof window !== undefined){
      setLoading(false)
    }
  }, [image, ctx, ref.current, router.isReady]);

  return (
    <div className="group">
      <div className="relative">
        {pr ?
        <div className="cursor-pointer aspect-w-1 aspect-h-[1.6] w-full overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-600">
          <Link href={`/search/${image.prompt}`} prefetch={false}>
            <a className="transition-transform duration-500 ease-out hover:scale-[1.1]">
              <img
                alt={image.title}
                src={gethref(image?.href, 256)}
                className={cn(
                  "duration-700 ease-in-out w-full h-full object-cover",
                  isLoading
                    ? "scale-110 blur-2xl grayscale"
                    : "scale-100 blur-0 grayscale-0"
                )}
                loading="lazy"
                onLoad={() => {
                  setLoading(false);
                }}
                onError={() => {
                  setisError(true)
                }}
              />
            </a>
          </Link>
        </div>
        :
        <div className="cursor-pointer aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-600">
          <Link href={`/artworks/${image.id}`} prefetch={false}>
            <a className="transition-transform duration-500 ease-out hover:scale-[1.1]">
              <img
                alt={image.title}
                src={gethref(image?.href)}
                className={cn(
                  "duration-700 ease-in-out w-full h-full object-cover",
                  isLoading
                    ? "scale-110 blur-2xl grayscale"
                    : "scale-100 blur-0 grayscale-0"
                )}
                loading="lazy"
                onLoad={() => {
                  setLoading(false);
                }}
                onError={() => {
                  setisError(true)
                }}
              />
            </a>
          </Link>
        </div>
        }
        {!preview &&
          <>
            {image.age_limit === "nsfw" && (
              <p className="absolute top-2 left-2 text-sm font-semibold bg-red-500 text-white px-2 rounded-md">
                NSFW
              </p>
            )}
            {image.age_limit === "r18" && (
              <p className="absolute top-2 left-2 text-sm font-semibold bg-red-500 text-white px-2 rounded-md">
                R-18
              </p>
            )}
            {image.age_limit === "r18g" && (
              <p className="absolute top-2 left-2 text-sm font-semibold bg-red-500 text-white px-2 rounded-md">
                R-18G
              </p>
            )}
            {image.images?.length > 1 && rank === undefined && (
              <p className="absolute top-2 right-2 text-sm flex flex-row justify-center items-center font-semibold bg-gray-600 opacity-80 text-white px-2 rounded-md">
                <DocumentIcon className="w-3 h-3 mr-0.5 stroke-[2.5]" />
                {image.images?.length}
              </p>
            )}
            {rank !== undefined && (
              <div
                className={`absolute top-2 right-2 text-base flex items-center justify-center font-semibold ${
                  rank === 1 && "bg-yellow-500"
                } ${rank === 2 && "bg-gray-400"} ${rank === 3 && "bg-orange-400"} ${
                  rank > 3 && "bg-gray-500"
                } text-white w-10 h-10 rounded-full`}
              >
                {rank}
              </div>
            )}
            <button
              aria-label={t('BlurImageComponent.LikeButton','いいねボタン')}
              className="absolute bottom-1 right-1 text-sm font-semibold px-2 rounded-md"
              onClick={(e) => handlelike(e)}
            >
              {isliked ? (
                <HeartSolidIcon className="w-8 h-8 text-pink-500"></HeartSolidIcon>
              ) : (
                <HeartIcon className="w-8 h-8 fill-white"></HeartIcon>
              )}
            </button>
          </>
        }
      </div>
      {!preview &&
        <div>
          <p className="mt-2 text-base font-semibold text-gray-900 dark:text-slate-50 text-ellipsis whitespace-nowrap overflow-hidden">
            {image.title}
          </p>
          <Link href={`/users/${image.author.uid}`} prefetch={false}>
            <a className="mt-1 w-full flex items-center">
              <img
                src={gethref(image.author.avatar_url, 40)}
                alt={t('BlurImageComponent.ProfileIcon','{{name}}のプロフィールアイコン', { "name": image?.author?.name })}
                width={20}
                height={20}
                sizes="20px"
                className="rounded-full"
              ></img>
              <h3 className="ml-2 text-base text-gray-700 dark:text-slate-300">
                {image.author.name}
              </h3>
            </a>
          </Link>
        </div>
      }
    </div>
  );
}
